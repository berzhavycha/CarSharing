export type Rental = {
  id: string;
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
