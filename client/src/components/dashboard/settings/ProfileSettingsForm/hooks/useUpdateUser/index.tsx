import { AxiosError } from 'axios';
import { useState } from 'react';

import { axiosInstance } from '@/api';
import { useCurrentUser } from '@/context';
import { Env } from '@/core';
import { pickUserErrorMessages, transformUserResponse } from '@/helpers';
import { UpdateUserDto, User, UserDto } from '@/types';
import { FieldErrorsState } from '@/types/error';

type AuthResponse = {
  user: User | null;
};

type HookReturn = {
  updateUser: (userDto: UpdateUserDto) => Promise<AuthResponse>;
  errors: FieldErrorsState<UserDto> | null;
};

export const useUpdateUser = (): HookReturn => {
  const { currentUser } = useCurrentUser();
  const [errors, setErrors] = useState<FieldErrorsState<UserDto> | null>(null);

  const updateUser = async (userDto: UpdateUserDto): Promise<AuthResponse> => {
    try {
      setErrors(null);

      console.log(userDto);
      const formData = new FormData();
      formData.append('firstName', userDto.firstName ?? '');
      formData.append('lastName', userDto.lastName ?? '');
      formData.append('email', userDto.email ?? '');
      if (userDto.oldPassword) formData.append('oldPassword', userDto.oldPassword);
      if (userDto.newPassword) formData.append('newPassword', userDto.newPassword);
      if (userDto.picture) formData.append('picture', userDto.picture as Blob);
      const { data } = await axiosInstance.patch(
        `${Env.API_BASE_URL}/users/${currentUser?.id}`,
        userDto,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

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
    updateUser,
    errors,
  };
};
