import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { transformUserResponse, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';

export const fetchCurrentUser = async (): Promise<
  Promise<ServiceUserResponse<{ unexpectedError: string }>>
> => {
  try {
    const { data } = await axiosInstance.get(`${Env.API_BASE_URL}/auth/current-user`);
    return { user: transformUserResponse(data) };
  } catch (error) {
    return { errors: { unexpectedError: UNEXPECTED_ERROR_MESSAGE } };
  }
};
