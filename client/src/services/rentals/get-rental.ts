import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { Car } from '@/types';

export const getRental = async (id: string): Promise<Car> => {
  const { data } = await axiosInstance.get(`${Env.RENTAL_API_BASE_URL}/rentals/${id}`);
  return data;
};
