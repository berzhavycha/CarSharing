import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '@/entities';

import { SingletonLoggerService } from './singleton-logger.service';

@Injectable()
export class RolesService {
  private readonly loggerService = SingletonLoggerService.getInstance();

  constructor(
    @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
  ) { }

  async createRole(name: string): Promise<Role> {
    try {
      const role = this.rolesRepository.create({
        name,
      });

      return this.rolesRepository.save(role);
    } catch (error) {
      this.loggerService.error(
        `Error creating a role: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByName(name: string): Promise<Role | null> {
    return this.rolesRepository.findOne({
      where: { name },
    });
  }
}
