export type UserDto = {
  email: string;
  password: string;
  firstName: string;
  role: string;
  lastName: string;
  confirmPassword?: string;
  invitationCode?: string;
  pictureUrl?: string;
};
