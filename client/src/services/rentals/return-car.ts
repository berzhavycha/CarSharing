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


function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const returnCar = async (id: string): Promise<ServiceReturn> => {
  try {
    await wait(2000)
    const { data } = await axiosInstance.patch(`${Env.API_BASE_URL}/rentals/${id}`);
    return { rental: data.rental, penalty: data.penalty, refund: data.refund };
  } catch (error) {
    return findFirstExpectedError<UserRentalErrors>(error, returnCarFieldMappings);
  }
};
