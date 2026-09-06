import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { createRentalFieldMappings, findFirstExpectedError } from '@/helpers';
import { Rental, RentalDto, UserRentalErrors } from '@/types';

type ServiceReturn = {
  rental?: Rental;
  error?: string;
};

export const createRental = async (
  rentalDto: RentalDto,
  idempotencyKey: string,
): Promise<ServiceReturn> => {
  try {
    const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/rentals`, rentalDto, {
      headers: {
        'Idempotency-Key': idempotencyKey,
      },
    });
    return { rental: data };
  } catch (error) {
    return findFirstExpectedError<RentalDto & UserRentalErrors>(error, createRentalFieldMappings);
  }
};