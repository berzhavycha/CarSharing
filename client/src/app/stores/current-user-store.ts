import { flow, Instance, types as t } from 'mobx-state-tree';

import { handleUserResponse, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchCurrentUser, removeAvatar, signIn, signOut, signUp, updateUser } from '@/services';
import {
  AuthenticatedUser,
  FieldErrorsState,
  SignInUserDto,
  SignUpUserDto,
  UpdateUserDto,
} from '@/types';

export type ServiceUserResponse<T extends object> = {
  user?: AuthenticatedUser;
  errors?: FieldErrorsState<T>;
};

export const User = t.model('User', {
  id: t.string,
  email: t.string,
  firstName: t.string,
  lastName: t.string,
  balance: t.maybeNull(t.number),
  role: t.string,
  avatarId: t.maybeNull(t.string),
});

export const CurrentUserStore = t
  .model('CurrentUserStore', {
    user: t.optional(t.maybeNull(User), null),
    signInErrors: t.optional(t.frozen<FieldErrorsState<SignInUserDto> | null>(), null),
    signUpErrors: t.optional(t.frozen<FieldErrorsState<SignUpUserDto> | null>(), null),
    signOutErrors: t.optional(t.frozen<FieldErrorsState<AuthenticatedUser> | null>(), null),
    updateErrors: t.optional(t.frozen<FieldErrorsState<UpdateUserDto> | null>(), null),
  })
  .actions((self) => ({
    signUp: flow(function* (userDto: SignUpUserDto) {
      self.signUpErrors = null;

      try {
        const response = yield signUp(userDto);
        handleUserResponse<SignUpUserDto>(
          response,
          (user) => (self.user = User.create(user)),
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
          (user) => (self.user = User.create(user)),
          (errors) => (self.signInErrors = errors),
        );
      } catch (error) {
        self.signInErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
      }
    }),
    signOut: flow(function* () {
      self.signOutErrors = null;

      try {
        const response = yield signOut();
        handleUserResponse(
          response,
          () => (self.user = null),
          (errors) => (self.signOutErrors = errors),
        );
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
    fetchCurrentUser: flow(function* () {
      try {
        const response = yield fetchCurrentUser();
        handleUserResponse(
          response,
          (user) => (self.user = user),
          () => {},
        );
      } catch (error) {
        self.user = null;
      }
    }),
    removeAvatar: flow(function* () {
      if (self.user) {
        const response = yield removeAvatar(self.user.id);
        handleUserResponse<{ picture: string }>(
          response,
          (user) => (self.user = user),
          () => {},
        );
      }
    }),
  }));

export type CurrentUserStoreType = Instance<typeof CurrentUserStore>;
