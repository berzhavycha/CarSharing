import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { errorHandler, transformUserResponse, updateUserFieldMappings } from '@/helpers';
import { UpdateUserDto } from '@/types';

export const updateUser = async (
  userId: string,
  userDto: UpdateUserDto,
): Promise<ServiceUserResponse<UpdateUserDto>> => {
  try {
    const formData = new FormData();
    Object.entries(userDto).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    if (userDto.picture) {
      formData.append('picture', userDto.picture as Blob, 'dsv');
    }

    const { data } = await axiosInstance.patch(`${Env.API_BASE_URL}/users/${userId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { user: transformUserResponse(data) };
  } catch (error) {
    return { errors: errorHandler<UpdateUserDto>(error, updateUserFieldMappings) };
  }
};
