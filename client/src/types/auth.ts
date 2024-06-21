export type UserDto = {
  email: string;
  password: string;
  firstName: string;
  role: string;
  lastName: string;
  confirmPassword?: string;
  invitationCode?: string;
};

export type User = {
  email: string;
  firstName: string;
  lastName: string;
  balance: number;
  role: string;
};
