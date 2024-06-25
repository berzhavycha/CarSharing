import { AxiosError } from 'axios';
import { useState } from 'react';

import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { UNEXPECTED_ERROR_MESSAGE, pickUserErrorMessages, transformUserResponse } from '@/helpers';
import { UpdateUserDto, UserDto } from '@/types';
import { FieldErrorsState } from '@/types/error';
import { useStore } from '@/context';

type HookReturn = {
  updateUser: (userDto: UpdateUserDto) => Promise<void>;
  errors: FieldErrorsState<UserDto> | null;
};

export const useUpdateUser = (): HookReturn => {
  const { currentUserStore } = useStore()
  const [errors, setErrors] = useState<FieldErrorsState<UserDto> | null>(null);

  const updateUser = async (userDto: UpdateUserDto): Promise<void> => {
    try {
      setErrors(null);

      const { data } = await axiosInstance.patch(
        `${Env.API_BASE_URL}/users/${currentUserStore.user?.id}`,
        userDto,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      currentUserStore.setUser(transformUserResponse(data))
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors(pickUserErrorMessages([error.response?.data.message]));
      } else {
        setErrors({ unexpectedError: UNEXPECTED_ERROR_MESSAGE })
      }
    }
  };

  return {
    updateUser,
    errors,
  };
};
