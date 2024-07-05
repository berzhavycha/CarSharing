import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { FilterOption } from '@/types';

type ServiceReturn = {
  types: FilterOption<string>[];
  capacity: FilterOption<number>[];
};

export const fetchCarsFilterOptions = async (): Promise<ServiceReturn> => {
  const { data } = await axiosInstance.get(`${Env.API_BASE_URL}/cars/filter-options`);
  return data;
};
