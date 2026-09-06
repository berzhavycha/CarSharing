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

import { UserErrorModel, UserModel } from '../models';

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

export const CurrentUserStore = t
  .model('CurrentUserStore', {
    user: t.optional(t.maybeNull(UserModel), null),
    errors: UserErrorModel,
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
    // A fresh idempotency key is generated per submission attempt. If the
    // request fails ambiguously (network drop, 5xx) and the hook retries with
    // the same key, the server returns the cached result without crediting
    // the balance again. A new form submission always generates a new key,
    // so intentional repeat top-ups are never blocked.
    topUp: flow(function* (userDto: UpdateUserBalanceDto, idempotencyKey: string) {
      if (self.user) {
        yield self.performUserAction<UpdateUserBalanceDto>('topUp', () =>
          topUp(self.user!.id, userDto, idempotencyKey),
        );
      }
    }),
    fetchCurrentUser: flow(function* () {
      try {
        const response = yield fetchCurrentUser();
        handleUserResponse(
          response,
          (user) => self.setUser(user),
          () => {},
        );
      } catch (error) {
        self.setUser(null);
      }
    }),
  }));

export type CurrentUserStoreType = Instance<typeof CurrentUserStore>;
