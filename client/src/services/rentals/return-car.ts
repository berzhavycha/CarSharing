import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { findFirstExpectedError, returnCarFieldMappings } from '@/helpers';
import { Rental, UserRentalErrors } from '@/types';

type ServiceReturn = {
  rental?: Rental;
  refund?: number;
  penalty?: number;
  error?: string;
};

export const returnCar = async (
  id: string,
  idempotencyKey: string,
): Promise<ServiceReturn> => {
  try {
    const { data } = await axiosInstance.patch(`${Env.API_BASE_URL}/rentals/${id}`, undefined, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return { rental: data.rental, penalty: data.penalty, refund: data.refund };
  } catch (error) {
    return findFirstExpectedError<UserRentalErrors>(error, returnCarFieldMappings);
  }
};