import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '@/controllers';
import { User } from '@/entities';
import { UsersService } from '@/services';

import {
  mockUsersService,
} from '../mocks';
import { makeLocalFile, makePicture, makeUser } from '../utils';

jest.mock('@nestjs/config');
const mockConfigService = {
  get: jest.fn(),
};

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('updateUser', () => {
    beforeEach(() => {
      jest.spyOn(mockConfigService, 'get').mockReturnValue('uploads');
    });

    it('should update user details', async () => {
      const user = makeUser()
      const userId = user.id;
      const updateUserDto = {
        firstName: 'new first name',
      };

      const updatedUser = makeUser({
        ...updateUserDto,
      })

      jest.spyOn(usersService, 'updateUser').mockResolvedValue(updatedUser);

      const result = await usersController.updateUser(
        userId,
        updateUserDto,
        undefined,
      );

      expect(result).toEqual(updatedUser);
    });

    it('should update user details with file upload', async () => {
      const user = makeUser()
      const userId = user.id;
      const updateUserDto = {
        firstName: 'new first name',
      };

      const updatedUser = makeUser({
        ...updateUserDto,
      })

      const localFile = makeLocalFile()
      const picture = makePicture()

      jest.spyOn(usersService, 'updateUser').mockResolvedValue({
        ...user,
        ...updateUserDto,
        avatarId: localFile.id,
      });

      const result = await usersController.updateUser(
        userId,
        updateUserDto,
        picture,
      );

      expect(result).toEqual(updatedUser);
    });
  });

  describe('topUpUserAccount', () => {
    it('should top up user account balance', async () => {
      const user = makeUser({ balance: 80 })
      const userId = user.id;
      const updateUserBalanceDto = {
        amount: 20,
      };

      const updatedUser: User = makeUser({
        balance: 100
      })

      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(updatedUser);

      const result = await usersController.topUpUserAccount(
        userId,
        updateUserBalanceDto,
      );

      expect(result).toBe(updatedUser);
    });
  });
});
