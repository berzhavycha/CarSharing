import { User } from "@/entities";
import { mockRole } from "./role.mock";
import { Roles } from "@/helpers";

export const userDetails = {
    firstName: "firstName",
    lastName: "lastName",
    email: 'mock@gmail.com',
    role: Roles.USER
}

export const secureUserData = {
    passwordHash: 'password_hash',
    passwordSalt: 'password_salt',
    refreshTokenHash: null,
    refreshTokenSalt: null,
}

export const createUserDtoMock = {
    userDetails,
    ...secureUserData
}

export const mockUser = {
    id: 'user-id',
    balance: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    rentals: [],
    transactions: [],
    ...userDetails,
    ...secureUserData,
    role: mockRole
} as User;