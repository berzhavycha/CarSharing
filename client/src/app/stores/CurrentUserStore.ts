import { types as t, flow } from "mobx-state-tree";
import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { AxiosError } from 'axios';
import { AuthType, UNEXPECTED_ERROR_MESSAGE, pickUserErrorMessages, transformUserResponse } from '@/helpers';
import { UserDto, FieldErrorsState, AuthenticatedUser } from '@/types';

const User = t.model("User", {
    id: t.string,
    email: t.string,
    firstName: t.string,
    lastName: t.string,
    balance: t.maybeNull(t.number),
    role: t.string,
    avatarId: t.maybeNull(t.string),
});

export const CurrentUserStore = t.model("CurrentUserStore", {
    user: t.optional(t.maybeNull(User), null),
    errors: t.optional(t.frozen<FieldErrorsState<UserDto> | null>(), null),
})
    .actions((self) => ({
        auth: flow(function* (authType: AuthType, userDto: UserDto) {
            try {
                self.errors = null;
                const apiEndpoint = authType === AuthType.SIGN_IN ? 'sign-in' : 'sign-up';

                const { data } = yield axiosInstance.post(`${Env.API_BASE_URL}/auth/${apiEndpoint}`, userDto);
                self.user = User.create(transformUserResponse(data));
            } catch (error) {
                if (error instanceof AxiosError) {
                    self.errors = pickUserErrorMessages([error.response?.data.message]);
                } else {
                    self.errors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
                }
            }
        }),
        setUser(user: AuthenticatedUser | null): void {
            self.user = user;
        },
        signOut: flow(function* () {
            try {
                yield axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-out`);
                self.user = null;
                self.errors = null;
            } catch (error) {
                self.errors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
            }
        }),
        fetchCurrentUser: flow(function* () {
            try {
                const { data } = yield axiosInstance.get(`${Env.API_BASE_URL}/auth/current-user`);
                self.user = transformUserResponse(data)
            } catch (error) {
                self.user = null
            }
        }),
    }));
