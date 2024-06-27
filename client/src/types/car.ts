import { LocalFile } from "./local-files";
import { PaginationDto } from "./pagination";

export type CarDto = {
  pictures: File[] | null;
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
};

export type Car = CarDto & {
  id: string;
  pictures: LocalFile[]
};


export type QueryCarsDto = PaginationDto & {
  search?: string
}