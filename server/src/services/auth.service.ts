import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { Response } from 'express-serve-static-core';

import { RegisterUserDto } from '@/dtos';
import { User } from '@/entities';
import {
  authErrorMessages,
  DUPLICATE_EMAIL_ERROR_CODE,
  hashValue,
  NODE_ENV,
  ONE_DAY_MILLISECONDS,
  Roles,
} from '@/helpers';
import { AuthResult, ITokens, JwtPayload } from '@/interfaces';

import { LoggerService } from './logger.service';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly loggerService: LoggerService,
  ) {}

  async signUp(registerUserDto: RegisterUserDto): Promise<AuthResult> {
    try {
      const { password, ...safeUser } = registerUserDto;

      const invitationCode = this.configService.get<string>(
        'ADMIN_INVITATION_CODE',
      );

      if (
        safeUser.role === Roles.ADMIN &&
        invitationCode !== safeUser.invitationCode
      ) {
        throw new BadRequestException(
          authErrorMessages.INVALID_INVITATION_CODE,
        );
      }

      const { salt, hash } = await hashValue(password);
      const user = await this.usersService.createUser({
        userDetails: safeUser,
        passwordHash: hash,
        passwordSalt: salt,
        refreshTokenHash: null,
        refreshTokenSalt: null,
      });

      return {
        user,
        tokens: await this.generateTokens(user.id, user.email),
      };
    } catch (error) {
      if (error.code === DUPLICATE_EMAIL_ERROR_CODE) {
        this.loggerService.warn(
          `Duplicate email registration attempt: ${registerUserDto.email}`,
        );
        throw new ConflictException(authErrorMessages.DUPLICATE_EMAIL);
      } else {
        this.loggerService.error(
          `Error during user registration: ${error.message}`,
          error.stack,
        );
        throw error;
      }
    }
  }

  async signIn(signedInUser: User): Promise<AuthResult> {
    return {
      user: signedInUser,
      tokens: await this.generateTokens(signedInUser.id, signedInUser.email),
    };
  }

  async signOut(userId: string): Promise<void> {
    await this.usersService.updateUser(userId, {
      refreshTokenHash: null,
      refreshTokenSalt: null,
    });
  }

  async refreshAccessToken(refreshToken: string): Promise<ITokens> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      await this.validateRefreshToken(decoded.sub, refreshToken);

      return this.generateTokens(decoded.sub, decoded.email);
    } catch (error) {
      this.loggerService.error(
        `Error during token refresh: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async validateRefreshToken(userId: string, token: string): Promise<void> {
    const { refreshTokenHash } = await this.usersService.findById(userId);
    if (refreshTokenHash && !(await bcrypt.compare(token, refreshTokenHash))) {
      throw new UnauthorizedException(authErrorMessages.INVALID_REFRESH_TOKEN);
    }
  }

  async generateTokens(userId: string, email: string): Promise<ITokens> {
    const payload: JwtPayload = { sub: userId, email };

    const accessToken = await this.jwtService.signAsync(payload);
    this.loggerService.log(
      JSON.stringify({
        message: 'Generating Access Token',
        userId,
        type: 'Access Token',
        expiresIn: this.configService.get<string>('JWT_ACCESS_TOKEN_TIME'),
      }),
    );

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_TIME'),
    });
    this.loggerService.log(
      JSON.stringify({
        message: 'Generating Refresh Token',
        userId,
        type: 'Refresh Token',
        expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_TIME'),
      }),
    );

    const { salt, hash } = await hashValue(refreshToken);
    await this.usersService.updateUser(userId, {
      refreshTokenHash: hash,
      refreshTokenSalt: salt,
    });

    return { accessToken, refreshToken };
  }

  setTokensCookies(response: Response, tokens: ITokens): void {
    const maxAge =
      ONE_DAY_MILLISECONDS *
      this.configService.get<number>('AUTH_COOKIE_EXPIRATION_DAYS_TIME');
    const secure =
      this.configService.get<string>('NODE_ENV') === NODE_ENV.production;

    this.loggerService.log(
      JSON.stringify({
        message: 'Setting Tokens in Cookies',
        maxAge,
        secure,
      }),
    );

    response.cookie('tokens', tokens, {
      httpOnly: true,
      maxAge,
      sameSite: secure ? 'none' : 'lax',
      secure,
    });
  }

  clearTokensCookies(response: Response): void {
    const secure =
      this.configService.get<string>('NODE_ENV') === NODE_ENV.production;

    this.loggerService.log(
      JSON.stringify({
        message: 'Clearing Tokens in Cookies',
        secure,
      }),
    );

    response.clearCookie('tokens', {
      httpOnly: true,
      sameSite: secure ? 'none' : 'lax',
      secure,
    });
  }

  async validateUserById(id: string): Promise<User> {
    try {
      const user = await this.usersService.findById(id);

      if (!user) {
        throw new UnauthorizedException();
      }

      return plainToClass(User, user);
    } catch (error) {
      this.loggerService.error(
        `Error during validation of user by id: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async validateUserCredentials(
    email: string,
    password: string,
  ): Promise<User | null> {
    try {
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException(authErrorMessages.INVALID_EMAIL);
      }

      if (await bcrypt.compare(password, user.passwordHash)) {
        return plainToClass(User, user);
      }

      throw new UnauthorizedException(authErrorMessages.INVALID_PASSWORD);
    } catch (error) {
      this.loggerService.error(
        `Error during validation of user credentials: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
