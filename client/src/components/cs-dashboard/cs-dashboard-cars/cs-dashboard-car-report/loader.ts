import { defer, LoaderFunctionArgs } from 'react-router-dom';

import { carsLoader } from '@/helpers';
import { Car } from '@/types';

export type CarsLoaderData = {
  cars: Car[];
  totalPages: number;
};

export const allCarsLoader = (args: LoaderFunctionArgs): ReturnType<typeof defer> => {
  return defer({
    data: carsLoader(args.request)
  })
}