import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { QueryRentalsDto, Rental } from '@/types';

type ServiceReturn = {
    rentals: Rental[];
    total: number;
};

export const fetchRentalHistory = async (queryDto: QueryRentalsDto): Promise<ServiceReturn> => {
    const { data } = await axiosInstance.get(`${Env.API_BASE_URL}/rentals/history`, {
        params: queryDto,
    });
    return { rentals: data[0], total: data[1] };
};
