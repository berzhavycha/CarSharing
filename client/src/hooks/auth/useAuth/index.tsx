import axios, { AxiosError } from 'axios';

import { Env } from '@/core';
import { pickUserErrorMessages, transformUserResponse, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { User, UserDto } from '@/types';
import { FieldErrorsState } from '@/types/error';

type AuthResponse = {
  user: User | null;
  errors: FieldErrorsState<UserDto> | null;
};

type HookReturn = {
  auth: (userDto: UserDto) => Promise<AuthResponse>;
};

export const useAuth = (): HookReturn => {
  const auth = async (userDto: UserDto): Promise<AuthResponse> => {
    try {
      const { data } = await axios.post(`${Env.API_BASE_URL}/auth/sign-up`, userDto);

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
