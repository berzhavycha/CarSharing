import { flow, Instance, types as t } from 'mobx-state-tree';

import { axiosInstance } from '@/api';
import { Env } from '@/core';
import {
  errorHandler,
  signInFieldMappings,
  signUpFieldMappings,
  transformUserResponse,
  UNEXPECTED_ERROR_MESSAGE,
  updateUserFieldMappings,
} from '@/helpers';
import {
  AuthenticatedUser,
  FieldErrorsState,
  SignInUserDto,
  SignUpUserDto,
  UpdateUserDto,
} from '@/types';

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
      try {
        self.signUpErrors = null;
        const { data } = yield axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-up`, userDto);
        self.user = User.create(transformUserResponse(data));
      } catch (error) {
        self.signUpErrors = errorHandler<SignUpUserDto>(error, signUpFieldMappings);
      }
    }),
    signIn: flow(function* (userDto: SignInUserDto) {
      try {
        self.signInErrors = null;
        const { data } = yield axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-in`, userDto);
        self.user = User.create(transformUserResponse(data));
      } catch (error) {
        self.signInErrors = errorHandler<SignInUserDto>(error, signInFieldMappings);
      }
    }),
    signOut: flow(function* () {
      try {
        yield axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-out`);
        self.user = null;
        self.signOutErrors = null;
      } catch (error) {
        self.signOutErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
      }
    }),
    updateUser: flow(function* (userDto: UpdateUserDto) {
      try {
        self.updateErrors = null;
        const { data } = yield axiosInstance.patch(
          `${Env.API_BASE_URL}/users/${self.user?.id}`,
          userDto,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        self.user = transformUserResponse(data);
      } catch (error) {
        self.updateErrors = errorHandler<UpdateUserDto>(error, updateUserFieldMappings);
      }
    }),
    fetchCurrentUser: flow(function* () {
      try {
        const { data } = yield axiosInstance.get(`${Env.API_BASE_URL}/auth/current-user`);
        self.user = transformUserResponse(data);
      } catch (error) {
        self.user = null;
      }
    }),
    removeAvatar: flow(function* () {
      try {
        const { data } = yield axiosInstance.patch(
          `${Env.API_BASE_URL}/users/${self.user?.id}/avatar`,
        );
        self.user = transformUserResponse(data);
      } catch (error) {
        self.updateErrors = errorHandler<UpdateUserDto>(error, updateUserFieldMappings);
      }
    }),
  }));

export type CurrentUserStoreType = Instance<typeof CurrentUserStore>;
