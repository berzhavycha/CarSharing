import { User } from '@entities';
import { extractJWTFromCookies } from '@helpers';
import { JwtPayload } from '@interfaces';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '@services';
import { Request } from 'express-serve-static-core';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request): string => extractJWTFromCookies(req, 'accessToken'),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return this.authService.validateUserById(payload.sub);
  }
}
