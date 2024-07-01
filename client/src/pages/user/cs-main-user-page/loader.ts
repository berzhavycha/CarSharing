import { defer } from 'react-router-dom';

import { fetchCars } from '@/services';
import { Car } from '@/types';
import { CarStatus } from '@/helpers';

export type InitialCarsLoaderData = {
  cars: Car[];
  totalPages: number;
};

export const initialCarsLoader = async (): Promise<Response | ReturnType<typeof defer>> => {
  const initialQueryDto = {
    page: 1,
    limit: 8,
    status: CarStatus.AVAILABLE
  };

  const data = fetchCars(initialQueryDto);

  return defer({
    data,
  });
};
