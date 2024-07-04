import { Role, User } from '@/entities';
import { Roles } from '@/helpers';
import { SafeUser } from '@/interfaces';

type UserDto = {
    userDetails: SafeUser;
    passwordHash: string;
    passwordSalt: string;
    refreshTokenHash: null | string;
    refreshTokenSalt: null | string;
}

export const makeCreateUserDto = (user?: Partial<UserDto>): UserDto => {
    return {
        userDetails: {
            email: 'useremail@gmail.com',
            firstName: 'user',
            lastName: 'user',
            role: Roles.USER
        },
        passwordHash: 'password-hash',
        passwordSalt: 'password-salt',
        refreshTokenHash: null,
        refreshTokenSalt: null,
        ...user,
    }
}

export const makeUser = (user?: Partial<User>): User => {
    return {
        id: 'user-id',
        balance: 0,
        createdAt: new Date(),
        updatedAt: new Date(),
        firstName: 'firstName',
        lastName: 'lastName',
        email: 'mock@gmail.com',
        passwordHash: 'password_hash',
        passwordSalt: 'password_salt',
        refreshTokenHash: null,
        refreshTokenSalt: null,
        rentals: [],
        avatarId: 'av-id',
        transactions: [],
        ...user,
    } as User
}

export const makeRole = (role?: Partial<Role>): Role => {
    return {
        id: 'role-id',
        name: 'user',
        ...role
    } as Role
}