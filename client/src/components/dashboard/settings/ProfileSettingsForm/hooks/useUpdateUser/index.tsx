import { AxiosError } from 'axios';
import { useState } from 'react';

import { axiosInstance } from '@/api';
import { useCurrentUser } from '@/context';
import { Env } from '@/core';
import { pickUserErrorMessages, transformUserResponse } from '@/helpers';
import { UpdateUserDto, UserDto } from '@/types';
import { FieldErrorsState } from '@/types/error';

type HookReturn = {
  updateUser: (userDto: UpdateUserDto) => Promise<void>;
  errors: FieldErrorsState<UserDto> | null;
};

export const useUpdateUser = (): HookReturn => {
  const { currentUser, setCurrentUser } = useCurrentUser();
  const [errors, setErrors] = useState<FieldErrorsState<UserDto> | null>(null);

  const updateUser = async (userDto: UpdateUserDto): Promise<void> => {
    try {
      setErrors(null);

      const { data } = await axiosInstance.patch(
        `${Env.API_BASE_URL}/users/${currentUser?.id}`,
        userDto,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      setCurrentUser(transformUserResponse(data))
    } catch (error) {
      if (error instanceof AxiosError) {
        setErrors(pickUserErrorMessages([error.response?.data.message]));
      }
    }
  };

  return {
    updateUser,
    errors,
  };
};
