import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';

import { LocalFileDto, UpdateUserBalanceDto, UpdateUserDto } from '@/dtos';
import { Rental, User } from '@/entities';
import {
  authErrorMessages,
  hashValue,
  Roles,
  TransactionType,
  USER_DEFAULT_BALANCE,
  usersErrorMessages,
} from '@/helpers';
import { SafeUser } from '@/interfaces';

import { LocalFilesService } from './local-files.service';
import { RolesService } from './roles.service';
import { TransactionsService } from './transactions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly transactionsService: TransactionsService,
    private readonly rolesService: RolesService,
    private localFilesService: LocalFilesService,
  ) {}

  async createUser(userData: {
    userDetails: SafeUser;
    passwordHash: string;
    passwordSalt: string;
    refreshTokenHash: null | string;
    refreshTokenSalt: null | string;
  }): Promise<User> {
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
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email },
      relations: ['role'],
    });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['role', 'avatar'],
    });

    if (!user) {
      throw new NotFoundException(usersErrorMessages.USER_NOT_FOUND);
    }

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto | Partial<User>,
    fileData?: LocalFileDto,
  ): Promise<User | null> {
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
      if (
        !(await bcrypt.compare(updateUserDto.oldPassword, user.passwordHash))
      ) {
        throw new BadRequestException(usersErrorMessages.INVALID_OLD_PASSWORD);
      }
      await this.updateUserPassword(user, updateUserDto);

      delete updateUserDto.oldPassword;
      delete updateUserDto.newPassword;
    }

    if (fileData) {
      const avatar = await this.localFilesService.saveLocalFileData(fileData);
      user.avatar = avatar;
    }

    if (updateUserDto.email) {
      const existingUserWithEmail = await this.findByEmail(updateUserDto.email);

      if (existingUserWithEmail && existingUserWithEmail.id !== user.id) {
        throw new BadRequestException(authErrorMessages.DUPLICATE_EMAIL);
      }
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async removeUserAvatar(user: User): Promise<void> {
    await this.localFilesService.removeFile(user.avatar.id);
    user.avatar = null;
    user.avatarId = null;
  }

  async updateUserPassword(
    user: User,
    updateUserDto: UpdateUserDto,
  ): Promise<void> {
    if (!(await bcrypt.compare(updateUserDto.oldPassword, user.passwordHash))) {
      throw new BadRequestException(usersErrorMessages.INVALID_OLD_PASSWORD);
    }

    if (updateUserDto.newPassword) {
      const { salt, hash } = await hashValue(updateUserDto.newPassword);
      user.passwordSalt = salt;
      user.passwordHash = hash;
    } else {
      throw new BadRequestException(usersErrorMessages.NO_NEW_PASSWORD);
    }
  }

  async updateUserBalance(
    options: {
      id: string;
      balanceDto: UpdateUserBalanceDto;
      transactionType: TransactionType;
      rental?: Rental;
    },
    manager?: EntityManager,
  ): Promise<User | null> {
    const user = await this.findById(options.id);

    const updateBalance = async (manager: EntityManager): Promise<User> => {
      await this.transactionsService.createTransaction(
        {
          amount: options.balanceDto.amount,
          description: `${options.transactionType} for ${options.id} user account`,
          type: options.transactionType,
          user,
          rental: options.rental,
        },
        manager,
      );

      user.balance = user.balance + options.balanceDto.amount;
      return manager.save(user);
    };

    if (manager) {
      return updateBalance(manager);
    }

    return this.usersRepository.manager.transaction(updateBalance);
  }
}
