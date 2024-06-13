import {
    ConflictException,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import { Response } from 'express-serve-static-core';

import { NODE_ENV, ONE_DAY_MILLISECONDS } from '@shared';

import { User, UsersService } from '@modules/users';

import { DUPLICATE_EMAIL_ERROR_CODE, errorMessages } from './constants';
import { RegisterUserDto } from './dtos';
import { HashResult, AuthResult, ITokens, JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
    constructor(
        private readonly configService: ConfigService,
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async signUp(registerUserDto: RegisterUserDto): Promise<AuthResult> {
        try {
            const { password, ...safeUser } = registerUserDto;

            const { salt, hash } = await this.hash(password);
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
                throw new ConflictException(errorMessages.DUPLICATE_EMAIL);
            } else {
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
        const decoded = await this.jwtService.verifyAsync(refreshToken, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        });

        await this.validateRefreshToken(decoded.sub, refreshToken);

        return this.generateTokens(decoded.sub, decoded.email);
    }

    async validateRefreshToken(userId: string, token: string): Promise<void> {
        const { refreshTokenHash } = await this.usersService.findById(userId);
        if (refreshTokenHash && !(await bcrypt.compare(token, refreshTokenHash))) {
            throw new UnauthorizedException(errorMessages.INVALID_REFRESH_TOKEN);
        }
    }

    private async hash(value: string): Promise<HashResult> {
        const salt = await bcrypt.genSalt();
        return { salt, hash: await bcrypt.hash(value, salt) };
    }

    private async generateTokens(
        userId: string,
        email: string,
    ): Promise<ITokens> {
        const payload: JwtPayload = { sub: userId, email };
        const accessToken = await this.jwtService.signAsync(payload);
        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            expiresIn: this.configService.get<string>('JWT_REFRESH_TOKEN_TIME'),
        });

        const { salt, hash } = await this.hash(refreshToken);
        await this.usersService.updateUser(userId, {
            refreshTokenHash: hash,
            refreshTokenSalt: salt,
        });

        return { accessToken, refreshToken };
    }

    setCookies(response: Response, tokens: ITokens): void {
        response.cookie('tokens', tokens, {
            httpOnly: true,
            maxAge:
                ONE_DAY_MILLISECONDS *
                this.configService.get<number>('AUTH_COOKIE_EXPIRATION_DAYS_TIME'),
            sameSite: 'lax',
            secure:
                this.configService.get<string>('NODE_ENV') === NODE_ENV.production,
        });
    }

    clearCookies(response: Response): void {
        response.clearCookie('tokens', {
            httpOnly: true,
            sameSite: 'lax',
            secure:
                this.configService.get<string>('NODE_ENV') === NODE_ENV.production,
        });
    }

    async validateUserById(id: string): Promise<User> {
        const user = await this.usersService.findById(id);

        if (!user) {
            throw new UnauthorizedException();
        }

        return plainToClass(User, user);
    }

    async validateUserCredentials(
        email: string,
        password: string,
    ): Promise<User | null> {
        const user = await this.usersService.findByEmail(email);
        if (!user) {
            throw new UnauthorizedException(errorMessages.INVALID_EMAIL);
        }

        if (await bcrypt.compare(password, user.passwordHash)) {
            return plainToClass(User, user);
        }

        throw new UnauthorizedException(errorMessages.INVALID_PASSWORD);
    }
}
