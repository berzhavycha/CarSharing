import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { Car, QueryCarsDto } from '@/types';

type ServiceReturn = {
  cars: Car[];
  total: number;
};

export const fetchCars = async (queryCarsDto: QueryCarsDto): Promise<ServiceReturn> => {
  try {
    const { data } = await axiosInstance.get(`${Env.API_BASE_URL}/cars`, { params: queryCarsDto });
    return { cars: data[0], total: data[1] };
  } catch (error) {
    return { cars: [], total: 0 };
  }
};
