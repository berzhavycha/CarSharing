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

export const returnCar = async (id: string): Promise<ServiceReturn> => {
  try {
    const { data } = await axiosInstance.post(`${Env.RENTAL_API_BASE_URL}/rentals/${id}/return`);
    return { rental: data.rental, penalty: data.penalty, refund: data.refund };
  } catch (error) {
    return findFirstExpectedError<UserRentalErrors>(error, returnCarFieldMappings);
  }
};
