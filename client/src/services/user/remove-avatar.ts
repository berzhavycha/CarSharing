import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { transformUserResponse } from '@/helpers';
import { UpdateUserDto } from '@/types';

export const removeAvatar = async (userId: string): Promise<ServiceUserResponse<UpdateUserDto>> => {
  const { data } = await axiosInstance.patch(`${Env.API_BASE_URL}/users/${userId}/avatar`);
  return { user: transformUserResponse(data) };
};
