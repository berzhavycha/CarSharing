import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { findFirstExpectedError, removeCarMapping } from '@/helpers';

type ServiceReturn = {
  error?: string;
};

export const removeCar = async (carId: string): Promise<ServiceReturn> => {
  try {
    return await axiosInstance.delete(`${Env.API_BASE_URL}/cars/${carId}`);
  } catch (error) {
    return findFirstExpectedError(error, removeCarMapping);
  }
};
