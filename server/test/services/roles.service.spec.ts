import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Role } from '@/entities';
import { RolesService } from '@/services';

import { makeRole } from '../utils';

jest.mock('../../src/services/singleton-logger.service.ts', () => ({
  SingletonLoggerService: {
    getInstance: jest.fn(() => ({
      error: jest.fn(),
      log: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    })),
  },
}));

describe('RolesService', () => {
  let rolesService: RolesService;
  let rolesRepository: Repository<Role>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: createMock<Repository<Role>>(),
        },
      ],
    })
      .useMocker(createMock)
      .compile();

    rolesService = module.get<RolesService>(RolesService);
    rolesRepository = module.get<Repository<Role>>(getRepositoryToken(Role));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(rolesService).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const roleName = 'user';
      const role = makeRole();

      jest.spyOn(rolesRepository, 'create').mockReturnValue(role);
      jest.spyOn(rolesRepository, 'save').mockResolvedValue(role);

      const result = await rolesService.createRole(roleName);

      expect(result).toBe(role);
      expect(rolesRepository.save).toHaveBeenCalledWith(role);
    });
  });

  describe('findByName', () => {
    it('should return a role when found', async () => {
      const role = makeRole();

      jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(role);

      const result = await rolesService.findByName(role.name);

      expect(result).toEqual(role);
    });

    it('should return null when role is not found', async () => {
      const nonExistingRole = 'non-existing-role';

      jest.spyOn(rolesRepository, 'findOne').mockResolvedValue(null);

      const result = await rolesService.findByName(nonExistingRole);

      expect(result).toBe(null);
    });
  });
});
