import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { createRentalFieldMappings, findFirstExpectedError } from '@/helpers';
import { Rental, RentalDto, UserRentalErrors } from '@/types';

type ServiceReturn = {
    rental?: Rental;
    error?: string;
};

export const returnCar = async (id: string): Promise<ServiceReturn> => {
    try {
        const { data } = await axiosInstance.patch(`${Env.API_BASE_URL}/rentals/${id}`);
        return { rental: data };
    } catch (error) {
        return findFirstExpectedError<RentalDto & UserRentalErrors>(error, createRentalFieldMappings);
    }
};
