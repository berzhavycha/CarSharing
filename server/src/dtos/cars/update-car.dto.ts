import { PartialType } from '@nestjs/mapped-types';

import { CreateCarDto } from './create-car.dto';
import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

export class UpdateCarDto extends PartialType(CreateCarDto) {
    @IsArray()
    @IsString({ each: true })
    @Transform(({ value }) => JSON.parse(value))
    existingImagesIds?: string[];
}
