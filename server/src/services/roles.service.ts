import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '@/entities';

@Injectable()
export class RolesService {
    constructor(
        @InjectRepository(Role) private readonly rolesRepository: Repository<Role>,
    ) { }

    async createRole(name: string): Promise<Role> {
        const role = this.rolesRepository.create({
            name,
        });

        return this.rolesRepository.save(role);
    }

    async findByName(name: string): Promise<Role | null> {
        return this.rolesRepository.findOne({
            where: { name },
        });
    }
}
