import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class RentCarDto {
  @IsString()
  carId: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pricePerHour: number;

  @IsNumber()
  hours: number;

  @IsString()
  pickUpLocation: string;

  @IsString()
  dropOffLocation: string;
}
