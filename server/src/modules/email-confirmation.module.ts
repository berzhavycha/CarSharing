import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { EmailConfirmationController } from '@/controllers';
import { JwtConfig } from '@/core';
import { EmailConfirmationService } from '@/services';

import { EmailModule } from './email.module';
import { UsersModule } from './users.module';

@Module({
  imports: [UsersModule, EmailModule, JwtModule.registerAsync(JwtConfig)],
  controllers: [EmailConfirmationController],
  providers: [EmailConfirmationService],
  exports: [EmailConfirmationService],
})
export class EmailConfirmationModule {}
