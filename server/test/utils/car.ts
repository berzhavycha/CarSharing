import { Car } from "@/entities";
import { CarStatus } from "@/helpers";

export const makeCar = (details?: Partial<Car>): Car => {
    return {
        id: 'car-id',
        pictures: [],
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
        updatedAt: new Date(),
        createdAt: new Date(),
        status: CarStatus.AVAILABLE,
        ...details
    };

}