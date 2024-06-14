import { IsEnum, IsInt, IsNumber, IsString, Length } from 'class-validator';

import { CAR_TYPE_LENGTH, CarStatus } from '@shared';

export class CreateCarDto {
  @IsString()
  imageUrl: string;

  @IsString()
  model: string;

  @IsInt()
  year: number;

  @IsString()
  description: string;

  @IsNumber()
  pricePerHour: number;

  @IsString()
  @Length(1, CAR_TYPE_LENGTH)
  type: string;

  @IsEnum(CarStatus)
  status: CarStatus;
}
