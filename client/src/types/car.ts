import { CarStatus } from "@/helpers";

export type CarDto = {
    pictures: false | File[] | null | FileList
    model: string;
    year: number;
    description: string;
    pricePerHour: number;
    type: string;
    status: string;
    capacity: number;
    fuelType: string;
    steering: string;
    fuelCapacity: number;
}

export type Car = CarDto & {
    id: string;
    picture_id: string;
}
