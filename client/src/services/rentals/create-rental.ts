import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { createRentalFieldMappings, findFirstExpectedError } from '@/helpers';
import { Rental, RentalDto, UserRentalErrors } from '@/types';

type ServiceReturn = {
  rental?: Rental;
  error?: string;
};

export const createRental = async (rentalDto: RentalDto): Promise<ServiceReturn> => {
  try {
    const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/rentals`, rentalDto);
    return { rental: data };
  } catch (error) {
    return findFirstExpectedError<RentalDto & UserRentalErrors>(error, createRentalFieldMappings);
  }
};
