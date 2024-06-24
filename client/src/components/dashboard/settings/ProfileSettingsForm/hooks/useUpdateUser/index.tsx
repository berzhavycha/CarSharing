import { AxiosError } from 'axios';

import { axiosInstance } from '@/api';
import { Env } from '@/core';
import {
    pickUserErrorMessages,
    transformUserResponse,
} from '@/helpers';
import { UpdateUserDto, User, UserDto } from '@/types';
import { FieldErrorsState } from '@/types/error';
import { useState } from 'react';
import { useCurrentUser } from '@/context';

type AuthResponse = {
    user: User | null;
};

type HookReturn = {
    updateUser: (userDto: UpdateUserDto) => Promise<AuthResponse>;
    errors: FieldErrorsState<UserDto> | null
};

export const useUpdateUser = (): HookReturn => {
    const { currentUser } = useCurrentUser()
    const [errors, setErrors] = useState<FieldErrorsState<UserDto> | null>(null);

    const updateUser = async (userDto: UpdateUserDto): Promise<AuthResponse> => {
        try {
            setErrors(null)

            console.log(userDto)
            const { data } = await axiosInstance.patch(`${Env.API_BASE_URL}/users/${currentUser?.id}`, userDto);

            return {
                user: transformUserResponse(data),
            };
        } catch (error) {
            if (error instanceof AxiosError) {
                setErrors(pickUserErrorMessages([error.response?.data.message]))
            }

            return {
                user: null,
            };
        }
    };

    return {
        updateUser,
        errors
    };
};
