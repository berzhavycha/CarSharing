import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';

export const signOut = async (): Promise<ServiceUserResponse<{
  unexpectedError: string;
}> | void> => {
  try {
    await axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-out`);
  } catch (error) {
    return { errors: { unexpectedError: UNEXPECTED_ERROR_MESSAGE } };
  }
};
