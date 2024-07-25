import { CarStatus } from '@/helpers';
import { Car } from '@/types';

export const makeCar = (details?: Partial<Car>): Car => {
  return {
    id: '',
    existingImagesIds: [],
    pictures: [],
    model: 'name',
    year: 2024,
    description: 'desc',
    pricePerHour: 20,
    type: 'type',
    status: CarStatus.AVAILABLE,
    capacity: 4,
    fuelType: 'type',
    steering: 'none',
    fuelCapacity: 4,
    ...details,
  };
};
