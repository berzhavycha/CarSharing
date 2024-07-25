import { UserType } from "@/app/models";
import { Roles } from "@/helpers";
import { AuthenticatedUser } from "@/types";

export const makeUser = (details?: Partial<AuthenticatedUser>): UserType => {
    return {
        id: '1',
        email: 'email@gmail.com',
        firstName: 'first name',
        lastName: 'last name',
        balance: 0,
        role: Roles.USER,
        avatar: null,
        avatarId: null,
        ...details
    }
}