import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserAvatar } from '../entities/user-avatar.entity';
import { UserAvatarService } from '../services';

@Module({
  imports: [TypeOrmModule.forFeature([UserAvatar])],
  controllers: [],
  providers: [UserAvatarService],
  exports: [UserAvatarService],
})
export class UserAvatarModule {}
