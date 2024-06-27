import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { addCarFieldMappings, errorHandler } from '@/helpers';
import { Car, CarDto, FieldErrorsState } from '@/types';

type ServiceReturn = {
  car?: Car;
  errors?: FieldErrorsState<CarDto>;
};

export const addNewCar = async (car: CarDto): Promise<ServiceReturn> => {
  try {
    const formData = new FormData();

    Object.entries(car).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value.toString());
      }
    });

    car.pictures?.forEach((file) => {
      formData.append('pictures', file, file.name);
    });

    const { data } = await axiosInstance.post(`${Env.API_BASE_URL}/cars`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return { car: data };
  } catch (error) {
    return { errors: errorHandler<CarDto>(error, addCarFieldMappings) };
  }
};
