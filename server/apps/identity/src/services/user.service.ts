/* eslint-disable @typescript-eslint/no-explicit-any */
import { CorrelationManager, hashValue } from '@app/shared';
import { FileCommands } from '@app/shared/contracts/file-commands.contracts';
import { UserEvents } from '@app/shared/contracts/user-events.contract';
import { Roles } from '@app/shared/helpers/constants/auth';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { DataSource, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { UpdateUserBalanceDto, UpdateUserDto } from '../dtos/users';
import { User } from '../entities';
import { UserOutboxEntity } from '../entities/user-outbox.entity';
import {
  authErrorMessages,
  USER_DEFAULT_BALANCE,
  usersErrorMessages,
} from '../helpers';
import {
  FILE_COMMANDS_PRODUCER,
  USER_EVENTS_PRODUCER,
} from '../helpers/constants/providers';
import { SafeUser } from '../interfaces';

import { RoleService } from './role.service';
import { UserAvatarService } from './user-avatar.service';

@Injectable()
export class UserService {
  private readonly loggerService = new Logger(UserService.name);

  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly rolesService: RoleService,
    private readonly userAvatarService: UserAvatarService,
    @Inject(USER_EVENTS_PRODUCER)
    private readonly userEventsProducer: EventProducer<UserEvents>,
    @Inject(FILE_COMMANDS_PRODUCER)
    private readonly fileCommandProducer: EventProducer<FileCommands>,
    private readonly correlationManager: CorrelationManager,
    private readonly dataSource: DataSource,
  ) {}

  async createUser(userData: {
    userDetails: SafeUser;
    passwordHash: string;
    passwordSalt: string;
    refreshTokenHash: null | string;
    refreshTokenSalt: null | string;
  }): Promise<User> {
    try {
      const {
        userDetails,
        passwordHash,
        passwordSalt,
        refreshTokenHash,
        refreshTokenSalt,
      } = userData;

      let role = await this.rolesService.findByName(userDetails.role);

      if (!role) {
        role = await this.rolesService.createRole(userDetails.role);
      }

      const balance = role.name !== Roles.ADMIN ? USER_DEFAULT_BALANCE : null;

      const user = this.usersRepository.create({
        ...userDetails,
        passwordHash,
        passwordSalt,
        refreshTokenHash,
        refreshTokenSalt,
        balance,
        role,
      });

      return this.usersRepository.save(user);
    } catch (error) {
      this.loggerService.error(
        `Error creating user: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['role', 'avatar'],
    });
  }

  async findById(id: string): Promise<User> {
    try {
      const user = await this.usersRepository.findOne({
        where: { id },
        relations: ['role', 'avatar'],
      });

      if (!user) {
        throw new NotFoundException(usersErrorMessages.USER_NOT_FOUND);
      }

      return user;
    } catch (error) {
      this.loggerService.error(
        `Error finding user by id: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto | Partial<User>,
    fileData?: Express.Multer.File,
  ): Promise<User | null> {
    try {
      const user = await this.findById(id);

      if (
        'existingImagesIds' in updateUserDto &&
        !updateUserDto.existingImagesIds.length &&
        user.avatar
      ) {
        await this.removeUserAvatar(user);
        delete updateUserDto.existingImagesIds;
      }

      if ('oldPassword' in updateUserDto && updateUserDto.oldPassword) {
        await this.updateUserPassword(user, updateUserDto);

        delete updateUserDto.oldPassword;
        delete updateUserDto.newPassword;
      }

      if (fileData) {
        const correlationId = uuidv4();

        await this.correlationManager.storePendingRequest(
          correlationId,
          user.id,
          'avatar_upload',
        );

        const fileDto = {
          ...fileData,
          originalname: fileData.originalname,
          mimetype: fileData.mimetype,
          encoding: fileData.encoding,
          filename: fileData.filename,
          size: fileData.size,
          path: fileData.path,
          buffer: fileData.buffer.toString('base64'),
        };

        await this.fileCommandProducer.sendEvent({
          type: 'UPLOAD_FILES',
          data: {
            files: [fileDto],
            metadata: {
              replyTo: Topics.USER_COMMANDS_CHANNEL_TOPIC,
              correlationId,
            },
          },
        });
      }

      if (updateUserDto.email) {
        const existingUserWithEmail = await this.findByEmail(
          updateUserDto.email,
        );

        if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
          throw new BadRequestException(authErrorMessages.DUPLICATE_EMAIL);
        }
      }

      Object.assign(user, updateUserDto);

      return this.usersRepository.save(user);
    } catch (error) {
      this.loggerService.error(
        `Error updating user: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async removeUserAvatar(user: User): Promise<void> {
    try {
      console.log('removeUserAvatar', user);
      await this.userAvatarService.remove(user.avatar.id);
      await this.fileCommandProducer.sendEvent({
        type: 'DELETE_FILES',
        data: {
          filesToDelete: [{ id: user.avatar.id }],
        },
      });
      user.avatar = null;
    } catch (error) {
      this.loggerService.error(
        `Error removing user avatar: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateUserPassword(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    try {
      if (
        !(await bcrypt.compare(updateUserDto.oldPassword, user.passwordHash))
      ) {
        throw new BadRequestException(usersErrorMessages.INVALID_OLD_PASSWORD);
      }

      if (updateUserDto.newPassword) {
        const { salt, hash } = await hashValue(updateUserDto.newPassword);
        user.passwordSalt = salt;
        user.passwordHash = hash;
      } else {
        throw new BadRequestException(usersErrorMessages.NO_NEW_PASSWORD);
      }
    } catch (error) {
      this.loggerService.error(
        `Error updating user password: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async checkBalance(
    userId: string,
    required: number,
  ): Promise<'sufficient' | 'insufficient'> {
    const user = await this.findById(userId);
    return user.balance >= required ? 'sufficient' : 'insufficient';
  }

  async initiateUserTopUpSaga(
    id: string,
    updateUserBalanceDto: UpdateUserBalanceDto,
  ): Promise<void> {
    const correlationId = uuidv4();

    await this.correlationManager.storePendingRequest(
      correlationId,
      id,
      updateUserBalanceDto,
    );

    await this.performTopUpTransaction({
      userId: id,
      amount: updateUserBalanceDto.amount,
      metadata: {
        correlationId,
        replyTo: Topics.TOP_UP_USER_ACCOUNT_CHANNEL_TOPIC,
      },
      useOutbox: true,
    });
  }

  async performTopUpTransaction(params: {
    userId: string;
    amount: number;
    metadata: {
      correlationId?: string;
      replyTo?: string;
    };
    useOutbox?: boolean;
  }): Promise<{ newBalance?: number }> {
    const { userId, amount, metadata, useOutbox } = params;
    const { replyTo, correlationId } = metadata;

    const topic = replyTo ?? Topics.USER_EVENTS_CHANNEL_TOPIC;

    try {
      return await this.dataSource.transaction(async (manager) => {
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) throw new Error('User not found');

        user.balance = (user.balance || 0) + amount;
        await manager.save(user);

        const event = {
          type: 'USER_BALANCE_TOPPED_UP' as const,
          data: {
            userId,
            amount,
            newBalance: user.balance,
            email: user.email,
            metadata: { correlationId },
          },
        };

        if (useOutbox) {
          await manager.save(UserOutboxEntity, {
            topic,
            eventType: event.type,
            payload: event.data,
            status: 'PENDING',
          });
        } else {
          await this.userEventsProducer.sendEvent(event, topic);
        }

        return { newBalance: user.balance };
      });
    } catch (error: any) {
      const failEvent = {
        type: 'USER_BALANCE_TOPUP_FAILED' as const,
        data: {
          userId,
          amount,
          reason: error.message,
          metadata: { correlationId },
        },
      };

      await this.userEventsProducer.sendEvent(failEvent, topic);

      throw error;
    }
  }

  async deductBalance(params: {
    userId: string;
    amount: number;
    metadata: {
      correlationId?: string;
      replyTo?: string;
    };
    useOutbox?: boolean;
  }): Promise<{ newBalance?: number }> {
    const { userId, amount, metadata, useOutbox } = params;
    const { replyTo, correlationId } = metadata;
    const topic = replyTo ?? Topics.USER_EVENTS_CHANNEL_TOPIC;

    try {
      return await this.dataSource.transaction(async (manager) => {
        const user = await manager.findOne(User, { where: { id: userId } });
        if (!user) throw new Error('User not found');
        if (user.balance < amount) throw new Error('Insufficient balance');

        user.balance -= amount;
        await manager.save(user);

        const event = {
          type: 'USER_BALANCE_DEDUCTED' as const,
          data: {
            userId,
            amount,
            newBalance: user.balance,
            email: user.email,
            metadata: { correlationId },
          },
        };

        if (useOutbox) {
          await manager.save(UserOutboxEntity, {
            topic,
            eventType: event.type,
            payload: event.data,
            status: 'PENDING',
            partitionKey: correlationId,
          });
        } else {
          await this.userEventsProducer.sendEvent(event, topic);
        }

        return { newBalance: user.balance };
      });
    } catch (error) {
      const failEvent = {
        type: 'USER_BALANCE_DEDUCTION_FAILED' as const,
        data: {
          userId,
          amount,
          reason: error.message,
          metadata: { correlationId },
        },
      };

      await this.userEventsProducer.sendEvent(failEvent, topic);
    }
  }
}
