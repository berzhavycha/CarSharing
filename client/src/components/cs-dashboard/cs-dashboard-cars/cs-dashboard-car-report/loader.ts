import { createSearchParams, defer, LoaderFunctionArgs, redirect } from 'react-router-dom';

import { Env } from '@/core';
import { DEFAULT_PAGINATION_ORDER, DEFAULT_PAGINATION_PAGE, OrderOptions } from '@/helpers';
import { fetchCars } from '@/services';
import { Car, Order } from '@/types';

export type LoaderData = {
  cars: Car[];
  totalPages: number;
};

export const carsLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<Response | ReturnType<typeof defer>> => {
  const url = new URL(request.url);
  const page = url.searchParams.get('page') || DEFAULT_PAGINATION_PAGE;
  const limit = url.searchParams.get('limit') || Env.ADMIN_CARS_PAGINATION_LIMIT;
  const search = url.searchParams.get('search') || '';
  const sort = url.searchParams.get('sort') || '';
  const order = (url.searchParams.get('order')?.toUpperCase() as Order) || DEFAULT_PAGINATION_ORDER;

  const isDefaultParamsNeeded = !url.searchParams.has('page') || !url.searchParams.has('limit');

  if (isDefaultParamsNeeded) {
    const defaultSearchParams = createSearchParams({
      page: page,
      limit: String(limit),
      ...(search && { search }),
      ...(sort && { sort }),
      ...(order !== OrderOptions.ASC && { order }),
    });

    return redirect(`${url.pathname}?${defaultSearchParams}`);
  }

  const queryCarsDto = {
    page: Number(page),
    limit: Number(limit),
    search,
    sort,
    order,
  };

  const data = fetchCars(queryCarsDto);

  return defer({
    data,
    promise: new Promise((resolve) => setTimeout(resolve, 2000)),
  });
};
