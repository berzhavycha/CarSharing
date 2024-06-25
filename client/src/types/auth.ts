export type SignUpUserDto = {
  email: string;
  password: string;
  firstName: string;
  role: string;
  lastName: string;
  confirmPassword?: string;
  invitationCode?: string;
  pictureUrl?: string;
};


export type SignInUserDto = Pick<SignUpUserDto, 'email' | 'password'>;