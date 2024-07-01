import { defer, LoaderFunctionArgs, redirect } from 'react-router-dom';

import { Env } from '@/core';
import { extractPaginationParams } from '@/helpers';
import { fetchCars } from '@/services';
import { Car } from '@/types';

export type CarsLoaderData = {
  cars: Car[];
  totalPages: number;
};

export const carsLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<Response | ReturnType<typeof defer>> => {
  const url = new URL(request.url);
  const { queryDto, defaultSearchParams } = extractPaginationParams(url, Env.ADMIN_CARS_PAGINATION_LIMIT);

  if (defaultSearchParams) {
    return redirect(`${url.pathname}?${defaultSearchParams}`);
  }

  const data = fetchCars(queryDto);

  return defer({
    data,
  });
};
