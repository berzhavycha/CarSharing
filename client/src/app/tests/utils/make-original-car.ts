import { OriginalCar } from '@/types';

export const makeOriginalCar = (details?: Partial<OriginalCar>): OriginalCar => {
  return {
    id: '',
    existingImagesIds: [],
    pictures: [],
    model: 'name',
    year: 2024,
    description: 'desc',
    pricePerHour: 20,
    type: 'type',
    capacity: 4,
    fuelType: 'type',
    steering: 'none',
    fuelCapacity: 4,
    ...details,
  };
};
