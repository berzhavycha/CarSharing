import { redirect } from 'react-router-dom';

import { Env } from '@/core';
import { extractPaginationParams } from '@/helpers';
import { FetchCarsServiceReturn, fetchCars } from '@/services';
import { Car } from '@/types';

export type CarsLoaderData = {
    cars: Car[];
    totalPages: number;
};

export const carsLoader = async (
    request: Request,
    isAvailable?: boolean
): Promise<Response | FetchCarsServiceReturn> => {
    const url = new URL(request.url);
    const { queryDto, defaultSearchParams } = extractPaginationParams(url, Env.ADMIN_CARS_PAGINATION_LIMIT);

    const types = url.searchParams.getAll('types[]');
    const capacities = url.searchParams.getAll('capacities[]');

    const extendedQueryDto = {
        ...queryDto,
        ...(types.length > 0 && { types }),
        ...(capacities.length > 0 && { capacities }),
    }

    if (defaultSearchParams) {
        return redirect(`${url.pathname}?${defaultSearchParams}`);
    }

    return fetchCars(extendedQueryDto, isAvailable);
};