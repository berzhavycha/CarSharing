import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { UsersController } from '@/controllers';
import { UpdateUserBalanceDto, UpdateUserDto } from '@/dtos';
import { User } from '@/entities';
import { TransactionType } from '@/helpers';
import { UsersService } from '@/services';

import {
  mockLocalFile,
  mockPicture,
  mockUser,
  mockUsersService,
} from '../mocks';

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
    it('should update user details', async () => {
      const mockUserId = mockUser.id;
      const mockUpdateUserDto: UpdateUserDto = {
        firstName: 'new first name',
      };

      const mockUpdatedUser: User = {
        ...mockUser,
        ...mockUpdateUserDto,
      };

      jest.spyOn(usersService, 'updateUser').mockResolvedValue(mockUpdatedUser);

      const result = await usersController.updateUser(
        mockUserId,
        mockUpdateUserDto,
        undefined,
      );

      expect(result).toBe(mockUpdatedUser);
      expect(usersService.updateUser).toHaveBeenCalledWith(
        mockUserId,
        mockUpdateUserDto,
        { filename: undefined, mimetype: undefined, path: undefined },
      );
    });

    it('should update user details with file upload', async () => {
      const mockUserId = mockUser.id;
      const mockUpdateUserDto: UpdateUserDto = {
        firstName: 'new first name',
      };

      jest.spyOn(usersService, 'updateUser').mockResolvedValue({
        ...mockUser,
        ...mockUpdateUserDto,
        avatarId: mockLocalFile.id,
      });

      const result = await usersController.updateUser(
        mockUserId,
        mockUpdateUserDto,
        mockPicture,
      );

      expect(result).toBeDefined();
      expect(result.firstName).toBe(mockUpdateUserDto.firstName);
      expect(result.avatarId).toBe(mockUser.avatarId);
    });
  });

  describe('topUpUserAccount', () => {
    it('should top up user account balance', async () => {
      const mockUserId = mockUser.id;
      const mockUpdateUserBalanceDto: UpdateUserBalanceDto = {
        amount: 100,
      };
      const mockUserBalance = mockUser.balance;

      const mockUpdatedUser: User = {
        ...mockUser,
        balance: mockUserBalance + mockUpdateUserBalanceDto.amount,
      };

      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(mockUpdatedUser);

      const result = await usersController.topUpUserAccount(
        mockUserId,
        mockUpdateUserBalanceDto,
      );

      expect(result).toBe(mockUpdatedUser);
      expect(usersService.updateUserBalance).toHaveBeenCalledWith({
        id: mockUserId,
        balanceDto: mockUpdateUserBalanceDto,
        transactionType: TransactionType.TOP_UP,
      });
    });
  });
});
