import { CarStatus } from '@/helpers';

export const createCarDtoMock = {
  imageUrl: 'image-url',
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
  status: CarStatus.AVAILABLE,
};
