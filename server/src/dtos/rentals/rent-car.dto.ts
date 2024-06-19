import { IsNumber, IsString } from 'class-validator';

export class RentCarDto {
  @IsString()
  carId: string;

  @IsNumber()
  days: number;
}
