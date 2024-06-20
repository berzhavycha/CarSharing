import { Car, OriginalCar, Rental, User } from '@/entities';
import { RentalStatus } from '@/helpers';

export const mockRental = {
  id: 'rental-id',
  rentalStart: new Date(),
  rentalEnd: new Date(),
  requestedDays: 2,
  status: RentalStatus.ACTIVE,
  pickUpLocation: 'London',
  dropOffLocation: 'London',
  createdAt: new Date(),
  updatedAt: new Date(),
  user: new User(),
  car: new Car(),
  originalCar: new OriginalCar(),
  transactions: [],
} as Rental;
