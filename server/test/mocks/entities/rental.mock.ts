import { Car, OriginalCar, Rental, User } from '@/entities';
import { RentalStatus } from '@/helpers';

export const mockRental = {
  id: 'rental-id',
  rentalStart: new Date(),
  rentalEnd: new Date(),
  requestedHours: 2,
  status: RentalStatus.ACTIVE,
  createdAt: new Date(),
  updatedAt: new Date(),
  user: new User(),
  car: new Car(),
  originalCar: new OriginalCar(),
  transactions: [],
} as Rental;
