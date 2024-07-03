import { RentalStatus } from "@/helpers";
import { Car } from "./car";
import { Transaction } from "./transaction";
import { PaginationDto } from "./pagination";

export type Rental = {
  id: string;
  rentalStart: string;
  rentalEnd: string;
  totalPrice: number;
  requestedHours: number;
  pickUpLocation: string;
  dropOffLocation: string;
  status: RentalStatus;
  createdAt: string;
  updatedAt: string;
  car: Car;
  originalCar: Car;
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
