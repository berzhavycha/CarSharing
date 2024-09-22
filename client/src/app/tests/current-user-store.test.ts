import { handleUserResponse, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import * as services from '@/services';
import { SignUpUserDto, UpdateUserBalanceDto } from '@/types';

import { CurrentUserStore, CurrentUserStoreType } from '../stores';

import { makeUser } from './utils';

jest.mock('@/services');

jest.mock('@/core', () => ({
  Env: {
    API_BASE_URL: 'http://test-api.example.com',
  },
}));

jest.mock('../../helpers/utils/auth/handle-user-response.ts', () => ({
  handleUserResponse: jest.fn(),
}));

describe('CurrentUserStore', () => {
  let store: CurrentUserStoreType;

  beforeEach(() => {
    store = CurrentUserStore.create({
      errors: {},
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('performUserAction', () => {
    it('should handle successful action', async () => {
      const user = makeUser();
      const action = jest.fn().mockResolvedValue({ user });
      (handleUserResponse as jest.Mock).mockImplementation((response, onSuccess) => {
        onSuccess(response.user);
      });

      await store.performUserAction('signIn', action);

      expect(store.user).toEqual(user);
    });

    it('should handle action with errors', async () => {
      const errors = { email: ['Invalid email'] };
      const action = jest.fn().mockResolvedValue({ errors });
      (handleUserResponse as jest.Mock).mockImplementation((response, _onSuccess, onError) => {
        onError(response.errors);
      });

      await store.performUserAction('signIn', action);

      expect(store.user).toBeNull();
      expect(store.errors.signIn).toEqual(errors);
    });

    it('should handle unexpected errors', async () => {
      const action = jest.fn().mockRejectedValue(new Error('Unexpected error'));

      await store.performUserAction('signIn', action);

      expect(store.user).toBeNull();
      expect(store.errors.signIn).toEqual({ unexpectedError: UNEXPECTED_ERROR_MESSAGE });
    });
  });

  describe('User actions', () => {
    it('should sign up user', async () => {
      const userDto = { email: 'test@example.com', password: 'password' } as SignUpUserDto;
      const user = makeUser();

      (handleUserResponse as jest.Mock).mockImplementation((response, onSuccess) => {
        onSuccess(response.user);
      });
      (services.signUp as jest.Mock).mockResolvedValue({ user });

      await store.signUp(userDto);

      expect(store.user).toEqual(user);
    });

    it('should sign in user', async () => {
      const userDto = { email: 'test@example.com', password: 'password' };
      const user = makeUser();

      (handleUserResponse as jest.Mock).mockImplementation((response, onSuccess) => {
        onSuccess(response.user);
      });
      (services.signIn as jest.Mock).mockResolvedValue({ user });

      await store.signIn(userDto);

      expect(store.user).toEqual(user);
    });

    it('should sign out user', async () => {
      store.setUser(makeUser());

      (handleUserResponse as jest.Mock).mockImplementation((response, onSuccess) => {
        onSuccess(response.user);
      });
      (services.signOut as jest.Mock).mockResolvedValue({});

      await store.signOut();

      expect(store.user).toBeNull();
    });

    it('should update user', async () => {
      const initialUser = makeUser();
      store.setUser(initialUser);

      const updateDto = { email: 'new@example.com' };
      const updatedUser = { ...initialUser, ...updateDto };

      (handleUserResponse as jest.Mock).mockImplementation((response, onSuccess) => {
        onSuccess(response.user);
      });
      (services.updateUser as jest.Mock).mockResolvedValue({ user: updatedUser });

      await store.updateUser(updateDto);

      expect(store.user).toEqual(updatedUser);
    });

    it('should top up user balance', async () => {
      const initialUser = makeUser();
      store.setUser(initialUser);
      const topUpDto = { amount: 50 } as UpdateUserBalanceDto;
      const updatedUser = { ...initialUser, balance: 150 };

      (handleUserResponse as jest.Mock).mockImplementation((response, onSuccess) => {
        onSuccess(response.user);
      });
      (services.topUp as jest.Mock).mockResolvedValue({ user: updatedUser });

      await store.topUp(topUpDto);

      expect(store.user?.balance).toBe(150);
    });

    it('should fetch current user', async () => {
      const user = makeUser();

      (handleUserResponse as jest.Mock).mockImplementation((response, onSuccess) => {
        onSuccess(response.user);
      });
      (services.fetchCurrentUser as jest.Mock).mockResolvedValue({ user });

      await store.fetchCurrentUser();

      expect(store.user).toEqual(user);
    });

    it('should handle fetch current user error', async () => {
      (services.fetchCurrentUser as jest.Mock).mockRejectedValue(new Error('Fetch error'));

      await store.fetchCurrentUser();

      expect(store.user).toBeNull();
    });
  });
});
