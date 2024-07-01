import { defer, LoaderFunctionArgs, redirect } from 'react-router-dom';

import { extractPaginationParams } from '@/helpers';
import { Car } from '@/types';
import { Env } from '@/core';
import { fetchCars } from '@/services';

export type CarsLoaderData = {
  cars: Car[];
  totalPages: number;
};

export const allCarsLoader = (args: LoaderFunctionArgs): Response | ReturnType<typeof defer> => {
  const url = new URL(args.request.url);
  const { queryDto, defaultSearchParams } = extractPaginationParams(url, Env.ADMIN_CARS_PAGINATION_LIMIT);

  if (defaultSearchParams) {
    return redirect(`${url.pathname}?${defaultSearchParams}`);
  }

  const data = fetchCars(queryDto)

  return defer({
    data
  })
}