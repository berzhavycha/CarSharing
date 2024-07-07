import { RentalStatus } from '@/helpers';

import { Car, OriginalCar } from './car';
import { PaginationDto } from './pagination';
import { Transaction } from './transaction';

export type Rental = {
  id: string;
  rentalStart: string;
  rentalEnd: string | null;
  totalPrice: number;
  requestedHours: number;
  pickUpLocation: string;
  dropOffLocation: string;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  car: Car;
  originalCar: OriginalCar;
  transactions: Transaction[];
};

export type RentalDto = {
  carId?: string;
  pickUpLocation: string;
  dropOffLocation: string;
  hours: number;
};

export type UserRentalErrors = {
  rental: string;
  balance: string;
  money: string;
  car: string;
};

export type QueryRentalsDto = PaginationDto & {
  search?: string;
};
