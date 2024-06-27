import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { errorHandler, signInFieldMappings, transformUserResponse } from '@/helpers';
import { SignInUserDto } from '@/types';

export const signIn = async (
  userDto: SignInUserDto,
): Promise<ServiceUserResponse<SignInUserDto>> => {
  try {
    const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/auth/sign-in`, userDto);
    return { user: transformUserResponse(data) };
  } catch (error) {
    return { errors: errorHandler<SignInUserDto>(error, signInFieldMappings) };
  }
};
