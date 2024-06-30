import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsArray, IsString } from 'class-validator';

import { CreateCarDto } from './create-car.dto';

export class UpdateCarDto extends PartialType(CreateCarDto) {
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => JSON.parse(value))
  existingImagesIds?: string[];
}
