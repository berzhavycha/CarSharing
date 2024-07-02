import { defer, LoaderFunctionArgs, redirect } from 'react-router-dom';
import { Env } from '@/core';
import { CarStatus, extractPaginationParams } from '@/helpers';
import { fetchCars, fetchCarsFilterOptions } from '@/services';
import { Car, FilterOption } from '@/types';

export type AvailableCarsLoaderData = {
  carsData: {
    cars: Car[];
    total: number;
  };
  filterOptions: {
    types: FilterOption<string>[];
    capacities: FilterOption<number>[];
    maxPrice: number;
  };
};

export const availableCarsLoader = (args: LoaderFunctionArgs): Response | ReturnType<typeof defer> => {
  const url = new URL(args.request.url);
  const { queryDto, defaultSearchParams } = extractPaginationParams(url, Env.USER_CARS_PAGINATION_LIMIT);

  const types = url.searchParams.getAll('types[]');
  const capacities = url.searchParams.getAll('capacities[]');
  const minPrice = url.searchParams.get('minPrice');
  const maxPrice = url.searchParams.get('maxPrice');

  const extendedQueryDto = {
    ...queryDto,
    ...(types.length > 0 && { types }),
    ...(capacities.length > 0 && { capacities }),
    ...(minPrice !== null && { minPrice: parseFloat(minPrice) }),
    ...(maxPrice !== null && { maxPrice: parseFloat(maxPrice) }),
    status: CarStatus.AVAILABLE,
  };

  if (defaultSearchParams) {
    return redirect(`${url.pathname}?${defaultSearchParams}`);
  }

  const carsData = fetchCars(extendedQueryDto);
  const filterOptions = fetchCarsFilterOptions();

  return defer({
    carsData,
    filterOptions,
  });
};