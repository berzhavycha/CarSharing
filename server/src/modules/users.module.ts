import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Role, User } from '@/entities';
import { RolesService, UsersService } from '@/services';
import { UsersController } from '@/controllers';
import { TransactionsModule } from './transactions.module';

@Module({
  imports: [TransactionsModule, TypeOrmModule.forFeature([User, Role])],
  controllers: [UsersController],
  providers: [UsersService, RolesService],
  exports: [UsersService],
})
export class UsersModule { }
