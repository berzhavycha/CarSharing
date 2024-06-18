import { OriginalCar } from "@/entities";

export const mockOriginalCar = {
    id: 'car-id',
    imageUrl: "old-image-url",
    model: "Model 1",
    year: 2024,
    description: "Car description",
    pricePerHour: 100,
    type: "Sport",
    rentals: [],
    updatedAt: new Date(),
    createdAt: new Date()
} as OriginalCar;