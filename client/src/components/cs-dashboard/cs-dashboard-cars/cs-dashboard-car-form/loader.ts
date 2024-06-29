import { defer, LoaderFunctionArgs } from 'react-router-dom';

import { getCar } from '@/services';
import { Car } from '@/types';

export type LoaderData = Car

export const carLoader = async ({
    request,
}: LoaderFunctionArgs): Promise<Response | ReturnType<typeof defer>> => {
    const url = new URL(request.url);
    const carId = url.searchParams.get('carId') ?? '';

    const data = getCar(carId);

    return defer({
        data,
    });
};
