import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { User } from '@/entities';
import { AuthService } from '@/services';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({ usernameField: configService.get<string>('LOGIN_FIELD') });
  }

  async validate(email: string, password: string): Promise<User> {
    return this.authService.validateUserCredentials(email, password);
  }
}
