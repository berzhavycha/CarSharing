import { SignInUserDto, SignUpUserDto } from '@/types';

export enum AuthType {
  SIGN_UP = 'signUp',
  SIGN_IN = 'signIn',
  SIGN_OUT = 'signOut',
}

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
}

export const UNAUTHORIZED_ERROR_CODE = 401;

export const signUpFieldMappings: Record<string, keyof SignUpUserDto> = {
  email: 'email',
  password: 'password',
  role: 'role',
  firstname: 'firstName',
  lastname: 'lastName',
  'invitation code': 'invitationCode',
};

export const signInFieldMappings: Record<string, keyof SignInUserDto> = {
  email: 'email',
  password: 'password',
};
