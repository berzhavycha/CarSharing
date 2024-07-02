import { defer, LoaderFunctionArgs, redirect } from 'react-router-dom';

import { CarStatus, extractPaginationParams, INITIAL_CARS_LIMIT } from '@/helpers';
import { fetchCars } from '@/services';
import { Car } from '@/types';

export type InitialCarsLoaderData = {
  cars: Car[];
  totalPages: number;
};

export const initialCarsLoader = async (
  args: LoaderFunctionArgs,
): Promise<Response | ReturnType<typeof defer>> => {
  const url = new URL(args.request.url);
  const { queryDto, defaultSearchParams } = extractPaginationParams(url, INITIAL_CARS_LIMIT);

  const extendedQueryDto = {
    ...queryDto,
    status: CarStatus.AVAILABLE,
  };

  if (defaultSearchParams) {
    return redirect(`${url.pathname}?${defaultSearchParams}`);
  }

  const data = fetchCars(extendedQueryDto);

  return defer({
    data,
  });
};
