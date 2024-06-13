import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Roles } from '@shared';

import { Role, User } from './entities';
import { SafeUser } from './interfaces';
import { USER_DEFAULT_BALANCE } from './constants';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) { }

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

    let role = await this.rolesRepository.findOne({
      where: { name: userDetails.role },
    });

    if (!role) {
      role = this.rolesRepository.create({
        name: userDetails.role,
      });

      await this.rolesRepository.save(role);
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
    return this.usersRepository.findOne({ where: { email }, relations: ['role'] });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id }, relations: ['role'] });
  }

  async updateUser(
    id: string,
    updateUserDto: Partial<User>,
  ): Promise<User | null> {
    const user = await this.findById(id);

    if (!user) {
      return null;
    }

    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }
}
