import { flow, Instance, t } from 'mobx-state-tree';

import { handleUserResponse, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchCurrentUser, signIn, signOut, signUp, topUp, updateUser } from '@/services';
import {
  AuthenticatedUser,
  FieldErrorsState,
  PublicFile,
  SignInUserDto,
  SignUpUserDto,
  UpdateUserBalanceDto,
  UpdateUserDto,
} from '@/types';

import { ErrorModel, UserModel } from '../models';

export type ServiceUserResponse<T extends object> = {
  user?: AuthenticatedUser;
  errors?: FieldErrorsState<T>;
};

type ErrorTypes =
  | SignInUserDto
  | SignUpUserDto
  | AuthenticatedUser
  | UpdateUserDto
  | UpdateUserBalanceDto;
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const CurrentUserStore = t
  .model('CurrentUserStore', {
    user: t.optional(t.maybeNull(UserModel), null),
    errors: ErrorModel,
    isLoading: t.optional(t.boolean, false),
  })
  .views((self) => ({
    get existingImages(): PublicFile[] {
      return self.user?.avatar ? [self.user.avatar] : [];
    },
  }))
  .actions((self) => ({
    setUser(user: AuthenticatedUser | null): void {
      self.user = user ? UserModel.create(user) : null;
    },
    setError<T extends ErrorTypes>(
      type: keyof typeof self.errors,
      error: FieldErrorsState<T> | null,
    ): void {
      self.errors = {
        ...self.errors,
        [type]: error,
      };
    },
    clearError(type: keyof typeof self.errors): void {
      self.errors = {
        ...self.errors,
        [type]: null,
      };
    },
    updateBalance(balance: number): void {
      if (self.user) {
        self.user.balance = balance;
      }
    },
  }))
  .actions((self) => ({
    performUserAction: flow(function* <T extends ErrorTypes>(
      actionType: keyof typeof self.errors,
      action: () => Promise<ServiceUserResponse<T> | void>,
    ) {
      self.clearError(actionType);
      self.isLoading = true;
      try {
        const response = yield action();
        yield wait(2000)
        handleUserResponse<T>(
          response,
          (user) => self.setUser(user),
          (errors) => self.setError<T>(actionType, errors),
        );
      } catch (error) {
        self.setError<T>(actionType, { unexpectedError: UNEXPECTED_ERROR_MESSAGE });
      } finally {
        self.isLoading = false;
      }
    }),
  }))
  .actions((self) => ({
    signUp: flow(function* (userDto: SignUpUserDto) {
      yield self.performUserAction<SignUpUserDto>('signUp', () => signUp(userDto));
    }),
    signIn: flow(function* (userDto: SignInUserDto) {
      yield self.performUserAction<SignInUserDto>('signIn', () => signIn(userDto));
    }),
    signOut: flow(function* () {
      yield self.performUserAction<AuthenticatedUser>('signOut', signOut);
      self.setUser(null);
    }),
    updateUser: flow(function* (userDto: UpdateUserDto) {
      if (self.user) {
        yield self.performUserAction<UpdateUserDto>('update', () =>
          updateUser(self.user!.id, userDto),
        );
      }
    }),
    topUp: flow(function* (userDto: UpdateUserBalanceDto) {
      if (self.user) {
        yield self.performUserAction<UpdateUserBalanceDto>('topUp', () =>
          topUp(self.user!.id, userDto),
        );
      }
    }),
    fetchCurrentUser: flow(function* () {
      try {
        const response = yield fetchCurrentUser();
        handleUserResponse(
          response,
          (user) => self.setUser(user),
          () => { },
        );
      } catch (error) {
        self.setUser(null);
      }
    }),
  }));

export type CurrentUserStoreType = Instance<typeof CurrentUserStore>;
