import { createMock } from '@golevelup/ts-jest';
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

import { makeResponse, makeTokens, makeUser } from '../utils';

describe('AuthController', () => {
  let authService: AuthService;
  let authController: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    })
      .useMocker(createMock)
      .compile();

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
    const userDto: RegisterUserDto = {
      firstName: 'firstName',
      lastName: 'lastName',
      password: 'password1',
      email: 'email@gmail.com',
      role: Roles.USER,
    };

    it('should create a new user and send him back', async () => {
      const tokens = makeTokens();
      const user = makeUser();
      const responseMock = makeResponse();

      jest.spyOn(authService, 'signUp').mockResolvedValue({ user, tokens });

      await authController.signUp(userDto, responseMock);

      expect(authService.signUp).toHaveBeenCalledWith(userDto);
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.CREATED);
      expect(responseMock.json).toHaveBeenCalledWith(plainToClass(User, user));
    });

    it('should send tokens in cookies on sign up', async () => {
      const tokens = makeTokens();
      const user = makeUser();
      const response = makeResponse();

      jest.spyOn(authService, 'signUp').mockResolvedValue({ user, tokens });

      await authController.signUp(userDto, response);

      expect(authService.setTokensCookies).toHaveBeenCalledWith(
        response,
        tokens,
      );
    });
  });

  describe('signIn', () => {
    const userDto: LoginUserDto = {
      password: 'password1',
      email: 'email@gmail.com',
    };

    it('should sign in a user and send him back', async () => {
      const user = makeUser();
      const tokens = makeTokens();
      const responseMock = makeResponse();
      const request = { user } as RequestWithUser;

      jest.spyOn(authService, 'signIn').mockResolvedValue({ user, tokens });

      await authController.signIn(userDto, responseMock, request);

      expect(authService.signIn).toHaveBeenCalledWith(request.user);
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.json).toHaveBeenCalledWith(user);
    });

    it('should send tokens in cookies on sign in', async () => {
      const user = makeUser();
      const tokens = makeTokens();
      const response = makeResponse();
      const request = { user } as RequestWithUser;

      jest.spyOn(authService, 'signIn').mockResolvedValue({ user, tokens });

      await authController.signIn(userDto, response, request);

      expect(authService.setTokensCookies).toHaveBeenCalledWith(
        response,
        tokens,
      );
    });
  });

  describe('refreshAccess', () => {
    it('should refresh access token and send a new pair of tokens back in cookies', async () => {
      const refreshToken = 'mockRefreshToken';

      const request = {
        cookies: {
          tokens: { refreshToken },
        },
      } as Request;

      const tokens = makeTokens();
      const responseMock = makeResponse();

      jest.spyOn(authService, 'refreshAccessToken').mockResolvedValue(tokens);

      await authController.refreshAccess(responseMock, request);

      expect(authService.refreshAccessToken).toHaveBeenCalledWith(refreshToken);
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.send).toHaveBeenCalled();
    });

    it('should throw an error if refresh token is not found', async () => {
      const request = {
        cookies: {},
      } as Request;

      const response = makeResponse();

      await expect(
        authController.refreshAccess(response, request),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('signOut', () => {
    it('should sign out a user', async () => {
      const userId = 'mockUserId';
      const responseMock = makeResponse();

      await authController.signOut(userId, responseMock);

      expect(authService.signOut).toHaveBeenCalledWith(userId);
      expect(responseMock.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(responseMock.send).toHaveBeenCalled();
    });

    it('should clear tokens in cookies on sign out', async () => {
      const userId = 'mockUserId';

      const response = makeResponse();

      await authController.signOut(userId, response);

      expect(authService.clearTokensCookies).toHaveBeenCalledWith(response);
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user when authenticated', async () => {
      const user = makeUser();
      const request = {
        user: plainToClass(User, user),
      } as RequestWithUser;

      const result = await authController.getCurrentUser(request.user);

      expect(result).toEqual(plainToClass(User, user));
    });

    it('should return null when no user is authenticated', async () => {
      const request = {
        user: null,
      } as RequestWithUser;

      const result = await authController.getCurrentUser(request.user);

      expect(result).toBeNull();
    });
  });
});
