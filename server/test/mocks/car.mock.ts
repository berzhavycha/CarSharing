import { Car } from "@/entities";
import { CarStatus } from "@/helpers";
import { mockOriginalCar } from "./original-car.mock";

export const mockCar = {
    ...mockOriginalCar,
    status: CarStatus.AVAILABLE,
    updatedAt: new Date()
} as Car;

