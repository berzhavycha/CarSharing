import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from '@/entities';

export interface OAuthTokenPayload {
  sub: string;
  email: string;
  scopes: string[];
  type: 'oauth_access' | 'oauth_refresh';
}

export interface OAuthTokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: 'Bearer';
  scope: string;
}

@Injectable()
export class OAuthTokenService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresIn: string;
  private readonly refreshExpiresIn: string;

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {
    // Reuse existing JWT secrets — OAuth tokens are validated by the same JwtStrategy
    this.accessSecret = this.configService.get<string>('JWT_ACCESS_SECRET');
    this.refreshSecret = this.configService.get<string>('JWT_REFRESH_SECRET');
    this.accessExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_TOKEN_TIME',
    );
    this.refreshExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_TOKEN_TIME',
    );
  }

  issueTokenPair(user: User, scopes: string[]): OAuthTokenPair {
    const basePayload = {
      sub: user.id,
      email: user.email,
      scopes,
    };

    const accessToken = this.jwtService.sign(
      { ...basePayload, type: 'oauth_access' },
      { secret: this.accessSecret, expiresIn: this.accessExpiresIn },
    );

    const refreshToken = this.jwtService.sign(
      { ...basePayload, type: 'oauth_refresh' },
      { secret: this.refreshSecret, expiresIn: this.refreshExpiresIn },
    );

    // Parse expiresIn string (e.g. "15m") into seconds for the response
    const expiresIn = this.parseExpiresIn(this.accessExpiresIn);

    return {
      accessToken,
      refreshToken,
      expiresIn,
      tokenType: 'Bearer',
      scope: scopes.join(' '),
    };
  }

  verifyRefreshToken(token: string): OAuthTokenPayload {
    try {
      const payload = this.jwtService.verify<OAuthTokenPayload>(token, {
        secret: this.refreshSecret,
      });

      if (payload.type !== 'oauth_refresh') {
        throw new UnauthorizedException('Invalid token type');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private parseExpiresIn(value: string): number {
    const unit = value.slice(-1);
    const amount = parseInt(value.slice(0, -1), 10);

    const multipliers: Record<string, number> = {
      s: 1,
      m: 60,
      h: 3600,
      d: 86400,
    };

    return amount * (multipliers[unit] ?? 1);
  }
}