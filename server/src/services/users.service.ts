import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { UpdateUserBalanceDto } from '@/dtos';
import { Rental, User } from '@/entities';
import {
  Roles,
  TransactionType,
  USER_DEFAULT_BALANCE,
  usersErrorMessages,
} from '@/helpers';
import { SafeUser } from '@/interfaces';

import { RolesService } from './roles.service';
import { TransactionsService } from './transactions.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    private readonly transactionsService: TransactionsService,
    private readonly rolesService: RolesService,
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
      relations: ['role'],
    });

    if (!user) {
      throw new NotFoundException(usersErrorMessages.USER_NOT_FOUND);
    }

    return user;
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<User>,
  ): Promise<User | null> {
    const user = await this.findById(id);

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
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
