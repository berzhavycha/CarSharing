import { AxiosError } from 'axios';

import { Env } from '@/core';
import { AuthType, pickUserErrorMessages, transformUserResponse, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { User, UserDto } from '@/types';
import { FieldErrorsState } from '@/types/error';
import { axiosInstance } from '@/api';

type AuthResponse = {
    user: User | null;
    errors: FieldErrorsState<UserDto> | null;
};

type HookReturn = {
    auth: (userDto: UserDto) => Promise<AuthResponse>;
};

export const useAuth = (authType: AuthType): HookReturn => {
    const apiEndpoint = authType === AuthType.SIGN_IN ? 'sign-in' : 'sign-up'

    const auth = async (userDto: UserDto): Promise<AuthResponse> => {
        try {
            const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/auth/${apiEndpoint}`, userDto);
            return {
                user: transformUserResponse(data),
                errors: null,
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                return {
                    user: null,
                    errors: pickUserErrorMessages([error.response?.data.message]),
                };
            }

            return {
                user: null,
                errors: { unexpectedError: UNEXPECTED_ERROR_MESSAGE },
            };
        }
    };

    return {
        auth,
    };
};
