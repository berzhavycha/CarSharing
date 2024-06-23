export type User = {
    email: string;
    firstName: string;
    lastName: string;
    balance: number;
    role: string;
    pictureUrl: string;
};

export type UpdateUserDto = Partial<{
    firstName: string;
    lastName: string;
    email: string;
    picture: File | undefined;
    newPassword: string;
    oldPassword: string;
}>