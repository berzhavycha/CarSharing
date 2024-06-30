import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { Car } from '@/types';

export const getCar = async (carId: string): Promise<Car> => {
  const { data } = await axiosInstance.get(`${Env.API_BASE_URL}/cars/${carId}`);
  return data;
};
