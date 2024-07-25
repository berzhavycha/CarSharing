import { RentalStatus } from "@/helpers";
import { Rental } from "@/types";
import { makeCar } from "./makeCar";
import { makeOriginalCar } from "./makeOriginalCar";

export const makeRental = (details?: Partial<Rental>): Rental => {
    return {
        id: '1',
        rentalStart: '2023-07-25T10:00:00Z',
        rentalEnd: '2023-07-26T10:00:00Z',
        totalPrice: 100,
        requestedHours: 24,
        pickUpLocation: 'Location A',
        dropOffLocation: 'Location B',
        status: RentalStatus.ACTIVE,
        createdAt: '2023-07-25T09:00:00Z',
        updatedAt: '2023-07-25T09:00:00Z',
        car: makeCar(),
        originalCar: makeOriginalCar(),
        transactions: [],
        ...details
    }
}