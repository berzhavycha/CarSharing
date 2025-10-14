import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { createRentalFieldMappings, findFirstExpectedError } from '@/helpers';
import { Rental, RentalDto, UserRentalErrors } from '@/types';

type ServiceReturn = {
  rental?: Rental;
  error?: string;
};

export const createRental = async (rentalDto: RentalDto & { pricePerHour: number }): Promise<ServiceReturn> => {
  try {
    const { data } = await axiosInstance.post(`${Env.RENTAL_API_BASE_URL}/rentals`, rentalDto);
    return { rental: data };
  } catch (error) {
    return findFirstExpectedError<RentalDto & UserRentalErrors>(error, createRentalFieldMappings);
  }
};
