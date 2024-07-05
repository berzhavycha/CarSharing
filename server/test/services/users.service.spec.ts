import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { EntityManager, Repository } from 'typeorm';

import { User } from '@/entities';
import { hashValue, usersErrorMessages } from '@/helpers';
import {
  LocalFilesService,
  RolesService,
  TransactionsService,
  UsersService,
} from '@/services';

import {
  testEntityManager,
  testLocalFilesService,
  testRoleService,
  testTransanctionService,
  testRepository,
} from '../test-objects';
import { makeCreateUserDto, makeHash, makeLocalFile, makeRole, makeUpdateUserBalanceOptions, makeUser } from '../utils';

jest.mock('../../src/helpers/utils/hash-value.ts', () => ({
  hashValue: jest.fn(),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let transactionsService: TransactionsService;
  let rolesService: RolesService;
  let usersRepository: Repository<User>;
  let localFilesService: LocalFilesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: testRepository,
        },
        {
          provide: TransactionsService,
          useValue: testTransanctionService,
        },
        {
          provide: RolesService,
          useValue: testRoleService,
        },
        {
          provide: LocalFilesService,
          useValue: testLocalFilesService,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    transactionsService = module.get<TransactionsService>(TransactionsService);
    rolesService = module.get<RolesService>(RolesService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
    localFilesService = module.get<LocalFilesService>(LocalFilesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser', () => {
    it('should create a user with existing role', async () => {
      const role = makeRole()
      const user = makeUser()
      const userDto = makeCreateUserDto()

      jest.spyOn(rolesService, 'findByName').mockResolvedValue(role);

      jest.spyOn(usersRepository, 'create').mockReturnValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      const result = await usersService.createUser(userDto);

      expect(result).toBe(user);
      expect(usersRepository.save).toHaveBeenCalledWith(user);
    });

    it('should create a user and a new role', async () => {
      const role = makeRole()
      const user = makeUser()
      const userDto = makeCreateUserDto()

      jest.spyOn(rolesService, 'findByName').mockResolvedValue(null);
      jest.spyOn(rolesService, 'createRole').mockResolvedValue(role);

      jest.spyOn(usersRepository, 'create').mockReturnValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(user);

      const result = await usersService.createUser(userDto);

      expect(result).toBe(user);
      expect(usersRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      const user = makeUser()
      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await usersService.findByEmail(user.email);

      expect(result).toEqual(user);
    });

    it('should return null when user is not found', async () => {
      const nonExistingEmail = 'non-existing-email@gmail.com';

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      const result = await usersService.findByEmail(nonExistingEmail);

      expect(result).toBe(null);
    });
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      const user = makeUser()

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(user);

      const result = await usersService.findById(user.id);

      expect(result).toEqual(user);
    });

    it('should throw NotFoundException when user is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(usersRepository, 'findOne').mockResolvedValue(null);

      await expect(usersService.findById(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('updateUser', () => {
    const updateUserDtoStub = {
      firstName: 'new first name',
    };

    it('should update a user', async () => {
      const user = makeUser()
      const updatedUser = makeUser({ firstName: 'new first name' })

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);

      const result = await usersService.updateUser(
        user.id,
        updateUserDtoStub,
      );

      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user with given id is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest
        .spyOn(usersService, 'findById')
        .mockImplementationOnce(() =>
          Promise.reject(
            new NotFoundException(usersErrorMessages.USER_NOT_FOUND),
          ),
        );

      await expect(
        usersService.updateUser(nonExistingId, updateUserDtoStub),
      ).rejects.toThrow(NotFoundException);
    });

    it('should update user with file', async () => {
      const user = makeUser()
      const localFile = makeLocalFile()
      const updatedUser = makeUser({
        avatarId: localFile.id,
        avatar: localFile,
        ...updateUserDtoStub,
      })

      jest
        .spyOn(localFilesService, 'saveLocalFileData')
        .mockResolvedValue(localFile);
      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);

      const result = await usersService.updateUser(
        user.id,
        updateUserDtoStub,
        localFile,
      );

      expect(result).toEqual(updatedUser);
      expect(usersRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should update user password', async () => {
      const updateUserDtoStub = {
        oldPassword: 'old password',
        newPassword: 'new password',
      };

      const user = makeUser()
      const hash = makeHash()
      const updatedUser = makeUser({
        passwordHash: hash.hash,
        passwordSalt: hash.salt,
      });

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      jest.spyOn(usersRepository, 'save').mockResolvedValue(updatedUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      (hashValue as jest.Mock).mockResolvedValueOnce(hash);

      const result = await usersService.updateUser(
        user.id,
        updateUserDtoStub,
      );

      expect(result).toEqual(updatedUser);
      expect(usersRepository.save).toHaveBeenCalledWith(updatedUser);
    });

    it('should throw BadRequestException if provided old password is invalid', async () => {
      const updateUserDtoStub = {
        oldPassword: 'invalid password',
        newPassword: 'new password',
      };

      const user = makeUser()

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

      await expect(
        usersService.updateUser(user.id, updateUserDtoStub),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if provided email if duplicated', async () => {
      const updateUserDtoStub = {
        email: 'duplicate@gmail.com',
      };

      const user = makeUser()

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      jest
        .spyOn(usersService, 'findByEmail')
        .mockResolvedValue({ ...user, id: 'new-id' });

      await expect(
        usersService.updateUser(user.id, updateUserDtoStub),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('updateUserBalance', () => {
    it('should update user balance within a created transaction if manager is provided', async () => {
      const user = makeUser()
      const balance = 100
      const options = makeUpdateUserBalanceOptions()

      jest.spyOn(testEntityManager, 'save').mockResolvedValue({
        ...user,
        balance,
      })

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      const result = await usersService.updateUserBalance(
        options,
        testEntityManager as unknown as EntityManager,
      );

      expect(result).toEqual(user);
      expect(transactionsService.createTransaction).toHaveBeenCalledWith(
        {
          amount: balance,
          description: `${options.transactionType} for ${options.id} user account`,
          type: options.transactionType,
          user: { ...user },
          rental: options.rental,
        },
        testEntityManager,
      );
      expect(testEntityManager.save).toHaveBeenCalledWith({
        ...user,
        balance,
      });
    });

    it('should update user balance and within repositories transaction', async () => {
      const user = makeUser()
      const options = makeUpdateUserBalanceOptions()

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      jest
        .spyOn(usersRepository.manager, 'transaction')
        .mockResolvedValue(user);

      const result = await usersService.updateUserBalance(options);

      expect(result).toEqual(user);
      expect(usersRepository.manager.transaction).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user is not found', async () => {
      const options = makeUpdateUserBalanceOptions()

      jest.spyOn(usersService, 'findById').mockImplementationOnce(() => {
        throw new NotFoundException(usersErrorMessages.USER_NOT_FOUND);
      });

      await expect(usersService.updateUserBalance(options)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
