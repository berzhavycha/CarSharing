import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersController } from '@/controllers';
import { Role, User } from '@/entities';
import { RolesService, UsersService } from '@/services';

import { PublicFilesModule } from './public-files.module';
import { TransactionsModule } from './transactions.module';

@Module({
  imports: [
    PublicFilesModule,
    TransactionsModule,
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [UsersService],
})
export class UsersModule {}
