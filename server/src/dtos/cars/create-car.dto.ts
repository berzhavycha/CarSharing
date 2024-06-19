import { IsEnum, IsInt, IsNumber, IsString, Length } from 'class-validator';

import { CAR_FIELD_MEDIUM_LENGTH, CarStatus } from '@/helpers';

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
  pricePerDay: number;

  @IsString()
  @Length(1, CAR_FIELD_MEDIUM_LENGTH)
  type: string;

  @IsEnum(CarStatus)
  status: CarStatus;
}
