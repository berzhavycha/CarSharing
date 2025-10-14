import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

import { CarPhoto } from '../entities';

import { CreateCarDto } from './create-car.dto';

export class CreateOriginalCarDto extends OmitType(CreateCarDto, [
  'status',
  'pictures',
]) {
  @IsNotEmpty()
  pictures: CarPhoto[];
}
