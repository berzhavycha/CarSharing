import { UserErrorType } from '@/app/models';

export const makeUserError = (details?: Partial<UserErrorType>): UserErrorType => {
  return {
    signIn: null,
    signUp: null,
    signOut: null,
    update: null,
    topUp: null,
    ...details,
  };
};
