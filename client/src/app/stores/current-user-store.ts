import { flow, Instance, types as t } from 'mobx-state-tree';

import { handleUserResponse, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchCurrentUser, signIn, signOut, signUp, updateUser } from '@/services';
import { topUp } from '@/services/user/top-up';
import {
  AuthenticatedUser,
  FieldErrorsState,
  SignInUserDto,
  SignUpUserDto,
  UpdateUserBalanceDto,
  UpdateUserDto,
} from '@/types';
import { UserModel } from '../models';

export type ServiceUserResponse<T extends object> = {
  user?: AuthenticatedUser;
  errors?: FieldErrorsState<T>;
};

export const CurrentUserStore = t
  .model('CurrentUserStore', {
    user: t.optional(t.maybeNull(UserModel), null),
    signInErrors: t.optional(t.frozen<FieldErrorsState<SignInUserDto> | null>(), null),
    signUpErrors: t.optional(t.frozen<FieldErrorsState<SignUpUserDto> | null>(), null),
    signOutErrors: t.optional(t.frozen<FieldErrorsState<AuthenticatedUser> | null>(), null),
    updateErrors: t.optional(t.frozen<FieldErrorsState<UpdateUserDto> | null>(), null),
    topUpErrors: t.optional(t.frozen<FieldErrorsState<UpdateUserBalanceDto> | null>(), null),
  })
  .views((self) => ({
    get existingImagesIds(): string[] {
      return self.user?.avatarId ? [self.user?.avatarId] : [];
    },
  }))
  .actions((self) => ({
    updateBalance: (balance: number): void => {
      if (self.user) {
        self.user.balance = balance;
      }
    },
    signUp: flow(function* (userDto: SignUpUserDto) {
      self.signUpErrors = null;

      try {
        const response = yield signUp(userDto);
        handleUserResponse<SignUpUserDto>(
          response,
          (user) => (self.user = UserModel.create(user)),
          (errors) => (self.signUpErrors = errors),
        );
      } catch (error) {
        self.signUpErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
      }
    }),
    signIn: flow(function* (userDto: SignInUserDto) {
      self.signInErrors = null;
      try {
        const response = yield signIn(userDto);
        handleUserResponse<SignInUserDto>(
          response,
          (user) => (self.user = UserModel.create(user)),
          (errors) => (self.signInErrors = errors),
        );
      } catch (error) {
        self.signInErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
      }
    }),
    signOut: flow(function* () {
      self.signOutErrors = null;

      try {
        yield signOut();
        self.user = null
      } catch (error) {
        self.signOutErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
      }
    }),
    updateUser: flow(function* (userDto: UpdateUserDto) {
      self.updateErrors = null;

      try {
        if (self.user) {
          const response = yield updateUser(self.user?.id, userDto);
          handleUserResponse<UpdateUserDto>(
            response,
            (user) => (self.user = user),
            (errors) => (self.updateErrors = errors),
          );
        }
      } catch (error) {
        self.updateErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
      }
    }),
    topUp: flow(function* (userDto: UpdateUserBalanceDto) {
      self.topUpErrors = null;

      try {
        if (self.user) {
          const response = yield topUp(self.user?.id, userDto);
          handleUserResponse<UpdateUserDto>(
            response,
            (user) => (self.user = user),
            (errors) => (self.topUpErrors = errors),
          );
        }
      } catch (error) {
        self.topUpErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
      }
    }),
    fetchCurrentUser: flow(function* () {
      try {
        const response = yield fetchCurrentUser();
        handleUserResponse(
          response,
          (user) => (self.user = user),
          () => { },
        );
      } catch (error) {
        self.user = null;
      }
    }),
  }));

export type CurrentUserStoreType = Instance<typeof CurrentUserStore>;
