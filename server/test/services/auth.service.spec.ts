import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';
import { Response } from 'express-serve-static-core';

import { User } from '@/entities';
import { DUPLICATE_EMAIL_ERROR_CODE, hashValue, Roles } from '@/helpers';
import { AuthService, LoggerService, UsersService } from '@/services';

import {
  testJwtService,
  testLoggerService,
  testUsersService,
} from '../test-objects';
import { makeHash, makeResponse, makeTokens, makeUser } from '../utils';

jest.mock('../../src/helpers/utils/hash-value.ts', () => ({
  hashValue: jest.fn(),
}));

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

jest.mock('@nestjs/config');
const testConfigService = {
  get: jest.fn().mockImplementation((key: string) => {
    switch (key) {
      case 'JWT_REFRESH_SECRET':
        return 'mock_refresh_secret';
      case 'JWT_REFRESH_TOKEN_TIME':
        return '1d';
      case 'AUTH_COOKIE_EXPIRATION_DAYS_TIME':
        return 7;
      case 'ADMIN_INVITATION_CODE':
        return '1234';
      case 'NODE_ENV':
        return 'production';
      default:
        return undefined;
    }
  }),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: ConfigService, useValue: testConfigService },
        { provide: UsersService, useValue: testUsersService },
        { provide: JwtService, useValue: testJwtService },
        { provide: LoggerService, useValue: testLoggerService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signUp', () => {
    const registerUserDto = {
      firstName: 'firstName',
      lastName: 'lastName',
      email: 'new@example.com',
      password: 'password',
      role: Roles.USER,
    };

    it('should create a new user and generate tokens', async () => {
      const hash = makeHash();
      const tokens = makeTokens();
      const user = makeUser();

      (hashValue as jest.Mock).mockResolvedValueOnce(hash);
      jest.spyOn(authService, 'generateTokens').mockResolvedValueOnce(tokens);
      jest.spyOn(usersService, 'createUser').mockResolvedValueOnce(user);

      const result = await authService.signUp(registerUserDto);

      expect(result.user).toEqual(user);
      expect(result.tokens.accessToken).toBe(tokens.accessToken);
      expect(result.tokens.refreshToken).toBe(tokens.refreshToken);
    });

    it('should throw ConflictException if email already exists', async () => {
      const hash = makeHash();

      (hashValue as jest.Mock).mockResolvedValueOnce(hash);
      jest.spyOn(testUsersService, 'createUser').mockImplementationOnce(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const error: any = new Error('Email already exists');
        error.code = DUPLICATE_EMAIL_ERROR_CODE;

        return Promise.reject(error);
      });
      await expect(authService.signUp(registerUserDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw BadException if invitation code is invalid', async () => {
      const registerDto = {
        ...registerUserDto,
        role: Roles.ADMIN,
        invitationCode: 'invalid-code',
      };

      await expect(authService.signUp(registerDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('signIn', () => {
    it('should return user and generate tokens', async () => {
      const tokens = makeTokens();
      const user = makeUser();

      jest.spyOn(authService, 'generateTokens').mockResolvedValue(tokens);

      const result = await authService.signIn(user);

      expect(result.user).toEqual(user);
      expect(result.tokens.accessToken).toBe(tokens.accessToken);
      expect(result.tokens.refreshToken).toBe(tokens.refreshToken);
    });
  });

  describe('signOut', () => {
    it('should clear refreshTokenHash and refreshTokenSalt for a user', async () => {
      const user = makeUser();

      const userId = user.id;

      await authService.signOut(userId);

      expect(usersService.updateUser).toHaveBeenCalledWith(userId, {
        refreshTokenHash: null,
        refreshTokenSalt: null,
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh access token', async () => {
      const userId = '123';
      const email = 'test@example.com';
      const refreshToken = 'stub-refresh-token';
      const existingTokens = makeTokens();

      const payload = { sub: userId, email };
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(payload);

      jest
        .spyOn(authService, 'validateRefreshToken')
        .mockResolvedValue(undefined);
      jest
        .spyOn(authService, 'generateTokens')
        .mockResolvedValue(existingTokens);

      const tokens = await authService.refreshAccessToken(refreshToken);

      expect(tokens).toEqual(existingTokens);
    });

    it('should throw UnauthorizedException for invalid refresh token', async () => {
      const invalidRefreshToken = 'invalid-refresh-token';

      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());

      await expect(
        authService.refreshAccessToken(invalidRefreshToken),
      ).rejects.toThrow(Error);
    });

    it('should throw UnauthorizedException if refresh token after failed validation', async () => {
      const userId = '123';
      const refreshToken = 'mock-refresh-token';

      const mockPayload = { sub: userId };
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValue(mockPayload);

      jest
        .spyOn(authService, 'validateRefreshToken')
        .mockImplementationOnce(() =>
          Promise.reject(new UnauthorizedException()),
        );

      await expect(
        authService.refreshAccessToken(refreshToken),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateRefreshToken', () => {
    it('should throw UnauthorizedException if refreshTokenHash does not match', async () => {
      const userId = '123';
      const refreshToken = 'mock-refresh-token';

      const user = makeUser({
        id: userId,
        refreshTokenHash: 'differentHash',
      });

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      expect(
        authService.validateRefreshToken(userId, refreshToken),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('generateTokens', () => {
    const userId = 'mock_user_id';
    const email = 'mock@example.com';

    it('should generate access and refresh tokens', async () => {
      const hash = makeHash();
      const tokens = makeTokens();
      const user = makeUser();

      (hashValue as jest.Mock).mockResolvedValue(hash);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);
      jest.spyOn(testUsersService, 'updateUser').mockResolvedValue(user);

      const result = await authService.generateTokens(userId, email);

      expect(result.accessToken).toBe(tokens.accessToken);
      expect(result.refreshToken).toBe(tokens.refreshToken);
    });

    it('should update user after generating tokens', async () => {
      const hash = makeHash();
      const tokens = makeTokens();
      const user = makeUser();

      (hashValue as jest.Mock).mockResolvedValue(hash);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);
      jest.spyOn(testUsersService, 'updateUser').mockResolvedValue(user);

      await authService.generateTokens(userId, email);

      expect(usersService.updateUser).toHaveBeenCalledWith(userId, {
        refreshTokenHash: hash.hash,
        refreshTokenSalt: hash.salt,
      });
    });

    it('should throw an error if JWT signing fails', async () => {
      jest
        .spyOn(jwtService, 'signAsync')
        .mockImplementationOnce(() => Promise.reject(new Error()));

      await expect(authService.generateTokens(userId, email)).rejects.toThrow(
        Error,
      );
    });

    it('should throw an error if hashing fails', async () => {
      const tokens = makeTokens();

      (hashValue as jest.Mock).mockRejectedValue(new Error('Hashing failed'));
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);

      await expect(authService.generateTokens(userId, email)).rejects.toThrow(
        'Hashing failed',
      );
    });

    it('should throw an error if updating user fails', async () => {
      const tokens = makeTokens();
      const hash = makeHash();

      (hashValue as jest.Mock).mockResolvedValue(hash);
      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);
      jest
        .spyOn(usersService, 'updateUser')
        .mockRejectedValue(new Error('Update user failed'));

      await expect(authService.generateTokens(userId, email)).rejects.toThrow(
        'Update user failed',
      );
    });
  });

  describe('setTokensCookies', () => {
    const WEEK = 7 * 24 * 60 * 60 * 1000;

    it('should set tokens cookie with correct options', () => {
      const tokens = makeTokens();
      const mockResponse = makeResponse();

      authService.setTokensCookies(mockResponse as unknown as Response, tokens);

      expect(mockResponse.cookie).toHaveBeenCalledWith('tokens', tokens, {
        httpOnly: true,
        maxAge: WEEK,
        sameSite: 'lax',
        secure: true,
      });
    });

    it('should set secure to false when NODE_ENV is not production', () => {
      const tokens = makeTokens();
      const mockResponse = makeResponse();

      testConfigService.get = jest
        .fn()
        .mockImplementationOnce((key: string) => {
          switch (key) {
            case 'AUTH_COOKIE_EXPIRATION_DAYS_TIME':
              return 7;
            case 'NODE_ENV':
              return 'development';
            default:
              return undefined;
          }
        });

      authService.setTokensCookies(mockResponse as unknown as Response, tokens);

      expect(mockResponse.cookie).toHaveBeenCalledWith('tokens', tokens, {
        httpOnly: true,
        maxAge: WEEK,
        sameSite: 'lax',
        secure: false,
      });
    });
  });

  describe('clearTokensCookies', () => {
    it('should clear tokens cookie with correct options', () => {
      const mockResponse = makeResponse();

      testConfigService.get = jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'NODE_ENV':
            return 'production';
          default:
            return undefined;
        }
      });

      authService.clearTokensCookies(mockResponse as unknown as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('tokens', {
        httpOnly: true,
        sameSite: 'lax',
        secure: true,
      });
    });

    it('should set secure to false when NODE_ENV is not production', () => {
      const mockResponse = makeResponse();

      testConfigService.get = jest.fn().mockImplementation((key: string) => {
        switch (key) {
          case 'NODE_ENV':
            return 'development';
          default:
            return undefined;
        }
      });

      authService.clearTokensCookies(mockResponse as unknown as Response);

      expect(mockResponse.clearCookie).toHaveBeenCalledWith('tokens', {
        httpOnly: true,
        sameSite: 'lax',
        secure: false,
      });
    });
  });

  describe('validateUserById', () => {
    it('should return a user if found', async () => {
      const user = makeUser();

      jest.spyOn(usersService, 'findById').mockResolvedValue(user);

      const result = await authService.validateUserById(user.id);

      expect(result).toEqual(plainToClass(User, user));
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const user = makeUser();

      jest.spyOn(usersService, 'findById').mockResolvedValue(null);

      await expect(authService.validateUserById(user.id)).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('validateUserCredentials', () => {
    it('should return a user if credentials are valid', async () => {
      const validPassword = 'validPassword';
      const user = makeUser();

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.validateUserCredentials(
        user.email,
        validPassword,
      );

      expect(result).toEqual(plainToClass(User, user));
    });

    it('should throw UnauthorizedException if email is invalid', async () => {
      const invalidEmail = 'invalid@example.com';

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(null);

      await expect(
        authService.validateUserCredentials(invalidEmail, 'password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const invalidPassword = 'invalidPassword';
      const user = makeUser();

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      await expect(
        authService.validateUserCredentials(user.email, invalidPassword),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
