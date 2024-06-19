import { IsNumber, IsString } from 'class-validator';

export class RentCarDto {
  @IsString()
  carId: string;

  @IsNumber()
  days: number;

  @IsString()
  pickUpLocation: string;

  @IsString()
  dropOffLocation: string;
}
