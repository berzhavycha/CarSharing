import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthController } from '../controllers';
import {
  JwtConfig,
  JwtRefreshTokenStrategy,
  JwtStrategy,
  LocalStrategy,
} from '../core/auth';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { AuthService } from '../services';

import { UserModule } from './user.module';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync(JwtConfig),
  ],
  providers: [
    JwtAuthGuard,
    AuthService,
    JwtStrategy,
    LocalStrategy,
    JwtRefreshTokenStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
