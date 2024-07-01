import { defer, LoaderFunctionArgs } from 'react-router-dom';

import { carsLoader } from '@/helpers';
import { Car } from '@/types';

export type AvailableCarsLoaderData = {
    cars: Car[];
    totalPages: number;
};

export const availableCarsLoader = (args: LoaderFunctionArgs): Promise<Response | ReturnType<typeof defer>> => carsLoader(args.request, true)