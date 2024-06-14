import { Role, User } from '@entities';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from '@services';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
