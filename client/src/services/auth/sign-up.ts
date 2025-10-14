import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { errorHandler, signUpFieldMappings, transformUserResponse } from '@/helpers';
import { SignUpUserDto } from '@/types';

export const signUp = async (
  userDto: SignUpUserDto,
): Promise<ServiceUserResponse<SignUpUserDto>> => {
  try {
    const { data } = await axiosInstance.post(`${Env.IDENTITY_API_BASE_URL}/auth/sign-up`, userDto);
    return { user: transformUserResponse(data) };
  } catch (error) {
    console.log(error)
    return { errors: errorHandler<SignUpUserDto>(error, signUpFieldMappings) };
  }
};
