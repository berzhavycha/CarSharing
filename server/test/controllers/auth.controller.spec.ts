import { HttpStatus, UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToClass } from 'class-transformer';
import { Request } from 'express-serve-static-core';

import { AuthController } from '@/controllers';
import { LoginUserDto, RegisterUserDto } from '@/dtos';
import { User } from '@/entities';
import { Roles } from '@/helpers';
import { RequestWithUser } from '@/interfaces';
import { AuthService } from '@/services';

import { mockAuthService, mockTokens, mockUser, responseMock } from '../mocks';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    authController = module.get<AuthController>(AuthController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signUp', () => {
    it('should sign up a new user', async () => {
      const userDto: RegisterUserDto = {
        firstName: 'firstName',
        lastName: 'lastName',
        password: 'password1',
        email: 'email@gmail.com',
        role: Roles.USER,
      };

      jest
        .spyOn(authService, 'signUp')
        .mockResolvedValue({ user: mockUser, tokens: mockTokens });

      await authController.signUp(userDto, responseMock);

      expect(authService.signUp).toHaveBeenCalledWith(userDto);
      expect(authService.setTokensCookies).toHaveBeenCalledWith(
        responseMock,
        mockTokens,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(responseMock.json).toHaveBeenCalledWith(
        plainToClass(User, mockUser),
      );
    });
  });

  describe('signIn', () => {
    it('should sign in a user', async () => {
      const userDto: LoginUserDto = {
        password: 'password1',
        email: 'email@gmail.com',
      };

      const requestMock = { user: mockUser } as RequestWithUser;

      jest
        .spyOn(authService, 'signIn')
        .mockResolvedValue({ user: mockUser, tokens: mockTokens });

      await authController.signIn(userDto, responseMock, requestMock);

      expect(authService.signIn).toHaveBeenCalledWith(requestMock.user);
      expect(authService.setTokensCookies).toHaveBeenCalledWith(
        responseMock,
        mockTokens,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('refreshAccess', () => {
    it('should refresh access token', async () => {
      const refreshToken = 'mockRefreshToken';

      const requestMock = {
        cookies: {
          tokens: { refreshToken },
        },
      } as Request;

      jest
        .spyOn(authService, 'refreshAccessToken')
        .mockResolvedValue(mockTokens);

      await authController.refreshAccess(responseMock, requestMock);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith(refreshToken);
      expect(authService.setTokensCookies).toHaveBeenCalledWith(
        responseMock,
        mockTokens,
      );
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.send).toHaveBeenCalled();
    });

    it('should throw an error if refresh token is not found', async () => {
      const requestMock = {
        cookies: {},
      } as Request;

      await expect(
        authController.refreshAccess(responseMock, requestMock),
      ).rejects.toThrow(UnauthorizedException);
      expect(authService.refreshAccessToken).not.toHaveBeenCalled();
      expect(authService.setTokensCookies).not.toHaveBeenCalled();
      expect(responseMock.status).not.toHaveBeenCalled();
      expect(responseMock.send).not.toHaveBeenCalled();
    });
  });

  describe('signOut', () => {
    it('should sign out a user', async () => {
      const userId = 'mockUserId';

      await authController.signOut(userId, responseMock);

      expect(authService.signOut).toHaveBeenCalledWith(userId);
      expect(authService.clearTokensCookies).toHaveBeenCalledWith(responseMock);
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.send).toHaveBeenCalled();
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const requestMock = {
        user: plainToClass(User, mockUser),
      } as RequestWithUser;

      const result = await authController.getCurrentUser(requestMock.user);

      expect(result).toEqual(plainToClass(User, mockUser));
    });

    it('should return null when no user is authenticated', async () => {
      const requestMock = {
        user: null,
      } as RequestWithUser;

      const result = await authController.getCurrentUser(requestMock.user);

      expect(result).toBeNull();
    });
  });
});
