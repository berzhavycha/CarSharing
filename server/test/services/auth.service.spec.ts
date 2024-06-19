import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing'
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService, UsersService } from '@/services';
import { DUPLICATE_EMAIL_ERROR_CODE, Roles, authErrorMessages } from '@/helpers';
import * as bcrypt from 'bcrypt';
import { Response } from 'express-serve-static-core';
import { User } from '@/entities';
import { plainToClass } from 'class-transformer';
import { mockTokens } from '../mocks';

jest.mock('@nestjs/config');
const mockConfigService = {
    get: jest.fn().mockImplementation((key: string) => {
        switch (key) {
            case 'JWT_REFRESH_SECRET':
                return 'mock_refresh_secret';
            case 'JWT_REFRESH_TOKEN_TIME':
                return '1d';
            case 'AUTH_COOKIE_EXPIRATION_DAYS_TIME':
                return 7;
            case 'NODE_ENV':
                return 'production';
            default:
                return undefined;
        }
    }),
};

const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn()
};

const mockUsersService = {
    createUser: jest.fn(),
    findById: jest.fn(),
    updateUser: jest.fn(),
    findByEmail: jest.fn(),
};

const mockUser = {
    id: 'mock_user_id',
    email: 'mock@example.com',
    firstName: "firstName",
    lastName: "lastName",
    passwordHash: 'passwordhash',
    role: Roles.USER
}

const mockHash = {
    hash: 'mock-hash',
    salt: 'mock-salt'
}

const mockResponse = {
    cookie: jest.fn(),
    clearCookie: jest.fn(),
};

describe('AuthService', () => {
    let authService: AuthService;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: ConfigService, useValue: mockConfigService },
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        authService = module.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.spyOn(authService, 'hash').mockClear();
        jest.spyOn(authService, 'generateTokens').mockClear();
        jest.spyOn(mockUsersService, 'createUser').mockClear();
        jest.spyOn(mockUsersService, 'updateUser').mockClear();
        jest.spyOn(mockUsersService, 'findById').mockClear();
        jest.spyOn(mockUsersService, 'findByEmail').mockClear();
        mockJwtService.signAsync.mockClear();
        mockJwtService.verifyAsync.mockClear();
    });

    it('should be defined', () => {
        expect(authService).toBeDefined();
    });

    describe('signUp', () => {
        const registerUserDto = { firstName: "firstName", lastName: "lastName", email: 'new@example.com', password: 'password', "role": Roles.USER };

        it('should create a new user and generate tokens', async () => {

            jest.spyOn(authService, 'hash').mockResolvedValue(mockHash);
            jest.spyOn(authService, 'generateTokens').mockResolvedValue(mockTokens);
            jest.spyOn(mockUsersService, 'createUser').mockImplementationOnce(() => Promise.resolve(mockUser))

            const result = await authService.signUp(registerUserDto);

            expect(result.user).toEqual(mockUser);
            expect(result.tokens.accessToken).toBe(mockTokens.accessToken);
            expect(result.tokens.refreshToken).toBe(mockTokens.refreshToken);
            expect(mockUsersService.createUser).toHaveBeenCalled();
        });

        it('should throw ConflictException if email already exists', async () => {
            jest.spyOn(mockUsersService, 'createUser').mockImplementationOnce(() => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const error: any = new Error('Email already exists');
                error.code = DUPLICATE_EMAIL_ERROR_CODE;

                return Promise.reject(error);
            });
            await expect(authService.signUp(registerUserDto)).rejects.toThrow(ConflictException);
        });
    });

    describe('signIn', () => {
        const loginUser = {
            id: 'mock_user_id',
            email: 'mock@example.com',
            firstName: "firstName",
            lastName: "lastName",
            password: 'passwordhash',
            role: { id: 'role-1', name: 'user', users: [] },
            balance: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
            transactions: [],
            rentals: [],
            passwordSalt: 'password-salt',
            passwordHash: 'password-hash',
            refreshTokenHash: 'refresh-hash',
            refreshTokenSalt: 'refresh-salt'
        }

        it('should return user and generate tokens', async () => {
            jest.spyOn(authService, 'generateTokens').mockResolvedValue(mockTokens);

            const result = await authService.signIn(loginUser);

            expect(result.user).toEqual(loginUser);
            expect(result.tokens.accessToken).toBe(mockTokens.accessToken);
            expect(result.tokens.refreshToken).toBe(mockTokens.refreshToken);
        });
    });

    describe('signOut', () => {
        it('should clear refresh token hash and salt for the user', async () => {
            const userId = mockUser.id;

            await authService.signOut(userId);

            expect(mockUsersService.updateUser).toHaveBeenCalledWith(userId, {
                refreshTokenHash: null,
                refreshTokenSalt: null,
            });
        });
    });

    describe('refreshAccessToken', () => {
        it('should refresh access token', async () => {
            const userId = '123';
            const email = 'test@example.com';
            const refreshToken = 'mock-refresh-token';

            const mockPayload = { sub: userId, email };
            jest.spyOn(mockJwtService, 'verifyAsync').mockResolvedValue(mockPayload);

            jest.spyOn(authService, 'validateRefreshToken').mockResolvedValue(undefined)
            jest.spyOn(authService, 'generateTokens').mockResolvedValue(mockTokens);

            const tokens = await authService.refreshAccessToken(refreshToken);

            expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken, { secret: 'mock_refresh_secret' });
            expect(authService.validateRefreshToken).toHaveBeenCalledWith(mockPayload.sub, refreshToken);
            expect(tokens).toEqual(mockTokens);
        });

        it('should throw UnauthorizedException for invalid refresh token', async () => {
            const invalidRefreshToken = 'invalid-refresh-token';

            jest.spyOn(mockJwtService, 'verifyAsync').mockRejectedValue(new Error(authErrorMessages.INVALID_REFRESH_TOKEN));

            await expect(authService.refreshAccessToken(invalidRefreshToken)).rejects.toThrow(Error);
        });

        it('should throw UnauthorizedException if refresh token after failed validation', async () => {
            const userId = '123';
            const refreshToken = 'mock-refresh-token';

            const mockPayload = { sub: userId };
            jest.spyOn(mockJwtService, 'verifyAsync').mockResolvedValue(mockPayload);

            jest.spyOn(authService, 'validateRefreshToken').mockImplementationOnce(() => Promise.reject(new UnauthorizedException()))

            await expect(authService.refreshAccessToken(refreshToken)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('validateRefreshToken', () => {
        it('should throw UnauthorizedException if refreshTokenHash does not match', async () => {
            const userId = '123';
            const refreshToken = 'mock-refresh-token';

            const mockUser = { id: userId, refreshTokenHash: 'differentHash' };
            jest.spyOn(mockUsersService, 'findById').mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

            expect(authService.validateRefreshToken(userId, refreshToken)).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('hash', () => {
        it('should generate a salt and hash the value', async () => {
            const mockValue = 'string'

            jest.spyOn(bcrypt, 'genSalt').mockResolvedValue(mockHash.salt)
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHash.hash)
            const result = await authService.hash(mockValue);

            expect(bcrypt.genSalt).toHaveBeenCalledTimes(1);
            expect(bcrypt.hash).toHaveBeenCalledWith(mockValue, mockHash.salt);

            expect(result).toEqual(mockHash);
        });
    });

    describe('generateTokens', () => {
        const userId = 'mock_user_id';
        const email = 'mock@example.com';

        it('should generate access and refresh tokens and update user', async () => {
            jest.spyOn(authService, 'hash').mockResolvedValue(mockHash);
            mockJwtService.signAsync
                .mockResolvedValueOnce(mockTokens.accessToken)
                .mockResolvedValueOnce(mockTokens.refreshToken);

            const result = await authService.generateTokens(userId, email);

            expect(result.accessToken).toBe(mockTokens.accessToken);
            expect(result.refreshToken).toBe(mockTokens.refreshToken);
            expect(authService.hash).toHaveBeenCalledWith(mockTokens.refreshToken);
            expect(mockUsersService.updateUser).toHaveBeenCalledWith(userId, {
                refreshTokenHash: mockHash.hash,
                refreshTokenSalt: mockHash.salt,
            });
        });

        it('should throw an error if JWT signing fails', async () => {
            mockJwtService.signAsync.mockRejectedValue(new Error('JWT signing failed'));

            await expect(authService.generateTokens(userId, email)).rejects.toThrow('JWT signing failed');
        });

        it('should throw an error if hashing fails', async () => {
            jest.spyOn(authService, 'hash').mockRejectedValue(new Error('Hashing failed'));
            mockJwtService.signAsync
                .mockResolvedValueOnce(mockTokens.accessToken)
                .mockResolvedValueOnce(mockTokens.refreshToken);

            await expect(authService.generateTokens(userId, email)).rejects.toThrow('Hashing failed');
        });

        it('should throw an error if updating user fails', async () => {
            jest.spyOn(authService, 'hash').mockResolvedValue(mockHash);
            mockJwtService.signAsync
                .mockResolvedValueOnce(mockTokens.accessToken)
                .mockResolvedValueOnce(mockTokens.refreshToken);
            mockUsersService.updateUser.mockRejectedValue(new Error('Update user failed'));

            await expect(authService.generateTokens(userId, email)).rejects.toThrow('Update user failed');
        });
    });

    describe('setTokensCookies', () => {
        const WEEK = 7 * 24 * 60 * 60 * 1000

        it('should set tokens cookie with correct options', () => {
            const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

            authService.setTokensCookies(mockResponse as unknown as Response, tokens);

            expect(mockResponse.cookie).toHaveBeenCalledWith('tokens', tokens, {
                httpOnly: true,
                maxAge: WEEK,
                sameSite: 'lax',
                secure: true,
            });
        });

        it('should set secure to false when NODE_ENV is not production', () => {
            mockConfigService.get = jest.fn().mockImplementationOnce((key: string) => {
                switch (key) {
                    case 'AUTH_COOKIE_EXPIRATION_DAYS_TIME':
                        return 7;
                    case 'NODE_ENV':
                        return 'development';
                    default:
                        return undefined;
                }
            });

            const tokens = { accessToken: 'access-token', refreshToken: 'refresh-token' };

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
            mockConfigService.get = jest.fn().mockImplementation((key: string) => {
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
            mockConfigService.get = jest.fn().mockImplementation((key: string) => {
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
            mockUsersService.findById.mockResolvedValue(mockUser);

            const result = await authService.validateUserById(mockUser.id);

            expect(result).toEqual(plainToClass(User, mockUser));
            expect(mockUsersService.findById).toHaveBeenCalledWith(mockUser.id);
        });

        it('should throw UnauthorizedException if user is not found', async () => {
            mockUsersService.findById.mockResolvedValue(null);

            await expect(authService.validateUserById(mockUser.id)).rejects.toThrow(UnauthorizedException);
            expect(mockUsersService.findById).toHaveBeenCalledWith(mockUser.id);
        });
    });

    describe('validateUserCredentials', () => {
        it('should return a user if credentials are valid', async () => {
            const validPassword = 'validPassword'

            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

            const result = await authService.validateUserCredentials(mockUser.email, validPassword);

            expect(result).toEqual(plainToClass(User, mockUser));
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(validPassword, mockUser.passwordHash);
        });

        it('should throw UnauthorizedException if email is invalid', async () => {
            const invalidEmail = 'invalid@example.com'

            mockUsersService.findByEmail.mockResolvedValue(null);

            await expect(authService.validateUserCredentials(invalidEmail, 'password')).rejects.toThrow(UnauthorizedException);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(invalidEmail);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            const invalidPassword = 'invalidPassword'

            mockUsersService.findByEmail.mockResolvedValue(mockUser);
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

            await expect(authService.validateUserCredentials(mockUser.email, invalidPassword)).rejects.toThrow(UnauthorizedException);
            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(mockUser.email);
            expect(bcrypt.compare).toHaveBeenCalledWith(invalidPassword, mockUser.passwordHash);
        });
    });
})