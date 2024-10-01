import { Instance, t } from 'mobx-state-tree';

import {
  AuthenticatedUser,
  ConfirmEmailDto,
  FieldErrorsState,
  SignInUserDto,
  SignUpUserDto,
  UpdateUserBalanceDto,
  UpdateUserDto,
} from '@/types';

export const UserErrorModel = t.model('ErrorModel', {
  signIn: t.maybeNull(t.frozen<FieldErrorsState<SignInUserDto>>()),
  signUp: t.maybeNull(t.frozen<FieldErrorsState<SignUpUserDto>>()),
  signOut: t.maybeNull(t.frozen<FieldErrorsState<AuthenticatedUser>>()),
  update: t.maybeNull(t.frozen<FieldErrorsState<UpdateUserDto>>()),
  topUp: t.maybeNull(t.frozen<FieldErrorsState<UpdateUserBalanceDto>>()),
  confirmEmail: t.maybeNull(t.frozen<FieldErrorsState<ConfirmEmailDto>>()),
});

export interface UserErrorType extends Instance<typeof UserErrorModel> {}
