import { CreateOriginalCarDto } from '@/dtos';
import { OriginalCar } from '@/entities';

export const makeOriginalCar = (
  details?: Partial<OriginalCar>,
): OriginalCar => {
  return {
    id: 'car-id',
    model: 'Model 1',
    year: 2024,
    description: 'Car description',
    pricePerHour: 100,
    type: 'Sport',
    rentals: [],
    fuelType: 'Petrol',
    fuelCapacity: 50,
    capacity: 50,
    steering: 'Left-Hand',
    createdAt: new Date(),
    pictures: [],
    ...details,
  };
};

export const makeOriginalCarDto = (
  details?: Partial<CreateOriginalCarDto>,
): CreateOriginalCarDto => {
  return {
    model: 'Model 1',
    year: 2024,
    description: 'Car description',
    pricePerHour: 100,
    type: 'Sport',
    fuelType: 'Petrol',
    fuelCapacity: 50,
    capacity: 50,
    steering: 'Left-Hand',
    pictures: [],
    ...details,
  };
};
