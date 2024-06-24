export type User = {
    id: string;
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
    picture: false | File | null | FileList;
    newPassword: string;
    oldPassword: string;
}>