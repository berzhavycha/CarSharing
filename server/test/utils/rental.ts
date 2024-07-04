import { RentCarDto } from "@/dtos";
import { Car, OriginalCar, Rental, User } from "@/entities";
import { RentalStatus } from "@/helpers";

export const makeRental = (details?: Partial<Rental>): Rental => {
    return {
        id: 'rental-id',
        rentalStart: new Date(),
        rentalEnd: new Date(),
        requestedHours: 2,
        status: RentalStatus.ACTIVE,
        pickUpLocation: 'London',
        dropOffLocation: 'London',
        createdAt: new Date(),
        updatedAt: new Date(),
        user: new User(),
        car: new Car(),
        originalCar: new OriginalCar(),
        transactions: [],
        ...details
    } as Rental;
}

export const makeRentalDto = (details?: Partial<RentCarDto>): RentCarDto => {
    return {
        carId: 'car-id-1',
        hours: 2,
        pickUpLocation: 'London',
        dropOffLocation: 'London',
        ...details
    };
}