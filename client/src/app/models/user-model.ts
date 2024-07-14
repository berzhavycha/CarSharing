import { t } from 'mobx-state-tree';

import {
  AuthenticatedUser,
  FieldErrorsState,
  PublicFile,
  SignInUserDto,
  SignUpUserDto,
  UpdateUserBalanceDto,
  UpdateUserDto,
} from '@/types';
import { Roles } from '@/helpers';

export const UserModel = t.model('UserModel', {
  id: t.string,
  email: t.string,
  firstName: t.string,
  lastName: t.string,
  balance: t.maybeNull(t.number),
  role: t.enumeration('Roles', [Roles.ADMIN, Roles.USER]),
  avatar: t.maybeNull(t.frozen<PublicFile>()),
  avatarId: t.maybeNull(t.string),
});

export const ErrorModel = t.model('ErrorModel', {
  signIn: t.maybeNull(t.frozen<FieldErrorsState<SignInUserDto>>()),
  signUp: t.maybeNull(t.frozen<FieldErrorsState<SignUpUserDto>>()),
  signOut: t.maybeNull(t.frozen<FieldErrorsState<AuthenticatedUser>>()),
  update: t.maybeNull(t.frozen<FieldErrorsState<UpdateUserDto>>()),
  topUp: t.maybeNull(t.frozen<FieldErrorsState<UpdateUserBalanceDto>>()),
});
