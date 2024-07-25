import { RentalStatus } from "@/helpers";
import { Rental } from "@/types";
import { makeCar } from "./make-car";
import { makeOriginalCar } from "./make-original-car";
import { RentalType } from "@/app/models";

export const makeRental = (details?: Partial<Rental>): RentalType => {
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
    } as RentalType
}