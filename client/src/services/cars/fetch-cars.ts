import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { Car, QueryCarsDto } from '@/types';

type ServiceReturn = {
  cars: Car[];
  total: number;
};

export const fetchCars = async (queryCarsDto: QueryCarsDto, isAvailable?: boolean): Promise<ServiceReturn> => {
  const url = isAvailable ? `${Env.API_BASE_URL}/cars/available` : `${Env.API_BASE_URL}/cars`
  
  const { data } = await axiosInstance.get(url, { params: queryCarsDto });
  return { cars: data[0], total: data[1] };
};
