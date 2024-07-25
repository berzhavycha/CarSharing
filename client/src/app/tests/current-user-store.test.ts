import * as services from '@/services';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { CurrentUserStoreType, CurrentUserStore } from '../stores';
import { makeUser } from './utils';
import { SignUpUserDto, UpdateUserBalanceDto } from '@/types';

jest.mock('@/services');

jest.mock('@/core', () => ({
    Env: {
        API_BASE_URL: 'http://test-api.example.com',
    },
}));


describe('CurrentUserStore', () => {
    let store: CurrentUserStoreType;

    beforeEach(() => {
        store = CurrentUserStore.create({
            errors: {}
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('performUserAction', () => {
        it('should handle successful action', async () => {
            const user = makeUser()
            const action = jest.fn().mockResolvedValue({ user });

            await store.performUserAction('signIn', action);

            expect(store.user).toEqual(user);
        });

        it('should handle action with errors', async () => {
            const errors = { email: ['Invalid email'] };
            const action = jest.fn().mockResolvedValue({ errors });

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
            (services.signUp as jest.Mock).mockResolvedValue({ user });

            await store.signUp(userDto);

            expect(store.user).toEqual(user);
        });

        it('should sign in user', async () => {
            const userDto = { email: 'test@example.com', password: 'password' };
            const user = makeUser();
            (services.signIn as jest.Mock).mockResolvedValue({ user });

            await store.signIn(userDto);

            expect(store.user).toEqual(user);
        });

        it('should sign out user', async () => {
            store.setUser(makeUser());

            (services.signOut as jest.Mock).mockResolvedValue({});

            await store.signOut();

            expect(store.user).toBeNull();
        });

        it('should update user', async () => {
            const initialUser = makeUser()
            store.setUser(initialUser);
            const updateDto = { email: 'new@example.com' };
            const updatedUser = { ...initialUser, ...updateDto };
            (services.updateUser as jest.Mock).mockResolvedValue({ user: updatedUser });

            await store.updateUser(updateDto);

            expect(store.user).toEqual(updatedUser);
        });

        it('should top up user balance', async () => {
            const initialUser = makeUser()
            store.setUser(initialUser);
            const topUpDto = { amount: 50 } as UpdateUserBalanceDto;
            const updatedUser = { ...initialUser, balance: 150 };
            (services.topUp as jest.Mock).mockResolvedValue({ user: updatedUser });

            await store.topUp(topUpDto);

            expect(store.user?.balance).toBe(150);
        });

        it('should fetch current user', async () => {
            const user = makeUser();
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