import { defer } from 'react-router-dom';

import { fetchCars } from '@/services';
import { Car } from '@/types';

export type InitialCarsLoaderData = {
  cars: Car[];
  totalPages: number;
};

export const initialCarsLoader = async (): Promise<Response | ReturnType<typeof defer>> => {
  const initialQueryDto = {
    page: 1,
    limit: 8,
  };

  const data = fetchCars(initialQueryDto, true);

  return defer({
    data,
  });
};
