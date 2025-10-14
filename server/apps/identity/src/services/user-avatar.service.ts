import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateUserAvatarDto } from '../dtos';
import { UserAvatar } from '../entities/user-avatar.entity';

// import { SingletonLoggerService } from './singleton-logger.service';

@Injectable()
export class UserAvatarService {
  // private readonly loggerService = SingletonLoggerService.getInstance();

  constructor(
    @InjectRepository(UserAvatar)
    private readonly userAvatarRepository: Repository<UserAvatar>,
  ) {}

  async create(dto: CreateUserAvatarDto): Promise<UserAvatar> {
    try {
      const avatar = this.userAvatarRepository.create(dto);
      return this.userAvatarRepository.save(avatar);
    } catch (error) {
      // this.loggerService.error(
      //   `Error creating a role: ${error.message}`,
      //   error.stack,
      // );
      console.log(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userAvatarRepository.delete({ id });
      if (result.affected === 0) {
        throw new NotFoundException(`Avatar with id ${id} not found`);
      }
      console.log(`Deleted avatar with id ${id}`);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
