import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '@/controllers';
import {
  JwtConfig,
  JwtRefreshTokenStrategy,
  JwtStrategy,
  LocalStrategy,
} from '@/core';
import { AuthService } from '@/services';

import { EmailConfirmationModule } from './email-confirmation.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JwtConfig),
    EmailConfirmationModule,
  ],
  providers: [AuthService, JwtStrategy, LocalStrategy, JwtRefreshTokenStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
