import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OAuthController } from '@/controllers';
import { OauthClient, OauthCode } from '@/entities';
import {
  OAuthClientService,
  OAuthCodeService,
  OAuthTokenService,
} from '@/services';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([OauthClient, OauthCode]),
    // JwtModule here is used only for signing OAuth tokens
    JwtModule.register({}),
    UsersModule,
  ],
  controllers: [OAuthController],
  providers: [OAuthClientService, OAuthCodeService, OAuthTokenService],
})
export class OAuthModule {}