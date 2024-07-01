import { defer, LoaderFunctionArgs } from 'react-router-dom';

import { carsLoader } from '@/helpers';
import { fetchCarsFilterOptions } from '@/services';
import { Car, FilterOption } from '@/types';

export type AvailableCarsLoaderData = {
    carsData: {
        cars: Car[],
        total: number,
    }
    filterOptions: {
        types: FilterOption<string>[],
        capacities: FilterOption<number>[]
    }
}

export const availableCarsLoader = async (args: LoaderFunctionArgs): Promise<Response | ReturnType<typeof defer>> => {
    const carsData = carsLoader(args.request, true)
    const filterOptions = fetchCarsFilterOptions()

    return defer({
        carsData,
        filterOptions,
    })
}