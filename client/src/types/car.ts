import { LocalFile } from './local-files';
import { PaginationDto } from './pagination';

export type CarDto = {
  pictures: File[] | null;
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
};

export type Car = CarDto & {
  id: string;
  pictures: LocalFile[];
};

export type QueryCarsDto = PaginationDto & {
  search?: string;
};
