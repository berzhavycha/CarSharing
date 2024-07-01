import { Transform } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
} from 'class-validator';

import { CAR_FIELD_MEDIUM_LENGTH, CarStatus } from '@/helpers';

export class CreateCarDto {
  @IsNotEmpty()
  pictures: Express.Multer.File[];

  @IsString()
  model: string;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  year: number;

  @IsString()
  description: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  pricePerHour: number;

  @IsString()
  @Length(1, CAR_FIELD_MEDIUM_LENGTH)
  type: string;

  @IsEnum(CarStatus)
  status: CarStatus;

  @IsInt()
  @Transform(({ value }) => parseInt(value, 10))
  capacity: number;

  @IsString()
  @Length(1, CAR_FIELD_MEDIUM_LENGTH)
  fuelType: string;

  @IsString()
  @Length(1, CAR_FIELD_MEDIUM_LENGTH)
  steering: string;

  @IsNumber()
  @Transform(({ value }) => parseFloat(value))
  fuelCapacity: number;
}
