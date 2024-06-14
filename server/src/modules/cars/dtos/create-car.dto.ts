import { IsString, IsInt, IsDecimal, IsEnum, Length } from 'class-validator';
import { CAR_TYPE_LENGTH, CarStatus, CAR_PRICE_PRECISION, CAR_PRICE_SCALE } from '@shared';

export class CreateCarDto {
    @IsString()
    imageUrl: string;

    @IsString()
    model: string;

    @IsInt()
    year: number;

    @IsString()
    description: string;

    @IsDecimal({ decimal_digits: `${CAR_PRICE_PRECISION},${CAR_PRICE_SCALE}` })
    pricePerHour: number;

    @IsString()
    @Length(1, CAR_TYPE_LENGTH)
    type: string;

    @IsEnum(CarStatus)
    status: CarStatus;
}