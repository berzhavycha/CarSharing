import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { carFieldMappings, createFormData, errorHandler } from '@/helpers';
import { Car, CarDto, FieldErrorsState } from '@/types';

type ServiceReturn = {
  car?: Car;
  errors?: FieldErrorsState<CarDto>;
};

export const addNewCar = async (car: CarDto): Promise<ServiceReturn> => {
  try {
    const formData = createFormData(car);

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
    return { errors: errorHandler<CarDto>(error, carFieldMappings) };
  }
};
