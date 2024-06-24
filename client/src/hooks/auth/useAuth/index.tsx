import { AxiosError } from 'axios';
import { useState } from 'react';

import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { AuthType, pickUserErrorMessages, transformUserResponse } from '@/helpers';
import { User, UserDto } from '@/types';
import { FieldErrorsState } from '@/types/error';

type AuthResponse = {
  user: User | null;
};

type HookReturn = {
  auth: (userDto: UserDto) => Promise<AuthResponse>;
  errors: FieldErrorsState<UserDto> | null;
};

export const useAuth = (authType: AuthType): HookReturn => {
  const [errors, setErrors] = useState<FieldErrorsState<UserDto> | null>(null);

  const apiEndpoint = authType === AuthType.SIGN_IN ? 'sign-in' : 'sign-up';

  const auth = async (userDto: UserDto): Promise<AuthResponse> => {
    try {
      setErrors(null);

      const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/auth/${apiEndpoint}`, userDto);

      return {
        user: transformUserResponse(data),
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors(pickUserErrorMessages([error.response?.data.message]));
      }

      return {
        user: null,
      };
    }
  };

  return {
    auth,
    errors,
  };
};
