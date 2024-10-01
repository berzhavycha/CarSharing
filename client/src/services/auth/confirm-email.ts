import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { confirmEmailFieldMappings, errorHandler, transformUserResponse } from '@/helpers';
import { ConfirmEmailDto, SignUpUserDto } from '@/types';

export const confirmEmail = async (
  confirmEmailDto: ConfirmEmailDto,
): Promise<ServiceUserResponse<SignUpUserDto>> => {
  try {
    const { data } = await axiosInstance.patch(
      `${Env.API_BASE_URL}/email-confirmation`,
      confirmEmailDto,
    );
    console.log(data);
    return { user: transformUserResponse(data) };
  } catch (error) {
    return { errors: errorHandler<ConfirmEmailDto>(error, confirmEmailFieldMappings) };
  }
};
