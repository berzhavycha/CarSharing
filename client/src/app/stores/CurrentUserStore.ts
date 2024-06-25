import { types as t, flow } from "mobx-state-tree";
import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { AxiosError } from 'axios';
import { UNEXPECTED_ERROR_MESSAGE, pickUserErrorMessages, transformUserResponse } from '@/helpers';
import { FieldErrorsState, AuthenticatedUser, SignInUserDto, SignUpUserDto } from '@/types';

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
    signInErrors: t.optional(t.frozen<FieldErrorsState<SignInUserDto> | null>(), null),
    signUpErrors: t.optional(t.frozen<FieldErrorsState<SignUpUserDto> | null>(), null),
    signOutErrors: t.optional(t.frozen<FieldErrorsState<AuthenticatedUser> | null>(), null),
})
    .actions((self) => ({
        signUp: flow(function* (userDto: SignUpUserDto) {
            try {
                self.signUpErrors = null;
                const { data } = yield axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-in`, userDto);
                self.user = User.create(transformUserResponse(data));
            } catch (error) {
                if (error instanceof AxiosError) {
                    self.signUpErrors = pickUserErrorMessages([error.response?.data.message]);
                } else {
                    self.signUpErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
                }
            }
        }),
        signIn: flow(function* (userDto: SignInUserDto) {
            try {
                self.signInErrors = null;
                const { data } = yield axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-in`, userDto);
                self.user = User.create(transformUserResponse(data));
            } catch (error) {
                if (error instanceof AxiosError) {
                    self.signInErrors = pickUserErrorMessages([error.response?.data.message]);
                } else {
                    self.signInErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
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
                self.signOutErrors = null;
            } catch (error) {
                self.signOutErrors = { unexpectedError: UNEXPECTED_ERROR_MESSAGE };
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
