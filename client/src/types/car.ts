export type CarDto = {
    pictures: false | File[] | null | FileList
    model: string;
    year: number | string;
    description: string;
    pricePerHour: number | string;
    type: string;
    status: string;
    capacity: number | string;
    fuelType: string;
    steering: string;
    fuelCapacity: number | string;
}

export type Car = CarDto & {
    id: string;
    picture_id: string;
}
