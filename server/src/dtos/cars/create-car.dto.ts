import { IsEnum, IsInt, IsNumber, IsString, Length } from 'class-validator';
import { CarStatus, CAR_FIELD_MEDIUM_LENGTH } from '@/helpers';

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

  @IsInt()
  capacity: number;

  @IsString()
  @Length(1, CAR_FIELD_MEDIUM_LENGTH)
  gasoline: string;

  @IsString()
  @Length(1, CAR_FIELD_MEDIUM_LENGTH)
  steering: string;

  @IsNumber()
  fuelCapacity: number;
}
