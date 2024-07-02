export type AuthenticatedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number | null;
  role: string;
  avatarId: string | null;
};

export type UpdateUserDto = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  picture: false | File | null | FileList;
  newPassword: string;
  oldPassword: string;
  existingImagesIds: string[];
}>;

export type UpdateUserBalanceDto = {
  amount: number;
}