import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { errorHandler, removeCarMapping } from '@/helpers';
import { Car } from '@/types';

type ServiceReturn = {
    error?: string;
};

export const removeCar = async (carId: string): Promise<ServiceReturn> => {
    try {
        return await axiosInstance.delete(`${Env.API_BASE_URL}/cars/${carId}`);
    } catch (error) {
        const errorMessages = errorHandler<Car>(error, removeCarMapping)
        const errorKeys = Object.keys(errorMessages);
        const firstErrorKey = errorKeys.find(key => key !== 'unexpectedError');
        if (firstErrorKey) {
            return { error: errorMessages[firstErrorKey as keyof Car] };
        }

        return { error: '' }
    }
};
