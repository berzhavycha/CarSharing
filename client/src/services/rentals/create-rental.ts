import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { createRentalFieldMappings, errorHandler } from '@/helpers';
import { FieldErrorsState, Rental, RentalDto, UserRentalErrors } from '@/types';

type ServiceReturn = {
    rental?: Rental;
    errors?: FieldErrorsState<RentalDto & UserRentalErrors>;
};

export const createRental = async (rentalDto: RentalDto): Promise<ServiceReturn> => {
    try {
        const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/rentals`, rentalDto);
        return { rental: data };
    } catch (error) {
        return { errors: errorHandler<RentalDto & UserRentalErrors>(error, createRentalFieldMappings) };
    }
};
