import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { errorHandler, transformUserResponse, updateUserFieldMappings } from '@/helpers';
import { UpdateUserDto } from '@/types';

export const removeAvatar = async (userId: string): Promise<ServiceUserResponse<UpdateUserDto>> => {
  try {
    const { data } = await axiosInstance.patch(`${Env.API_BASE_URL}/users/${userId}/avatar`);
    return { user: transformUserResponse(data) };
  } catch (error) {
    return { errors: errorHandler<UpdateUserDto>(error, updateUserFieldMappings) };
  }
};
