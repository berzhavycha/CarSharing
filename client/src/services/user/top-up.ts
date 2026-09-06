import { axiosInstance } from '@/api';
import { ServiceUserResponse } from '@/app/stores';
import { Env } from '@/core';
import { errorHandler, transformUserResponse, updateUserBalanceFieldMappings } from '@/helpers';
import { UpdateUserBalanceDto } from '@/types';

export const topUp = async (
  userId: string,
  userDto: UpdateUserBalanceDto,
  idempotencyKey: string,
): Promise<ServiceUserResponse<UpdateUserBalanceDto>> => {
  try {
    const { data } = await axiosInstance.patch(
      `${Env.API_BASE_URL}/users/${userId}/top-up`,
      userDto,
      {
        headers: {
          'Idempotency-Key': idempotencyKey,
        },
      },
    );
    return { user: transformUserResponse(data) };
  } catch (error) {
    return { errors: errorHandler<UpdateUserBalanceDto>(error, updateUserBalanceFieldMappings) };
  }
};