import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

import { PublicFile } from '@/entities';

import { CreateCarDto } from '../cars';

export class CreateOriginalCarDto extends OmitType(CreateCarDto, [
  'status',
  'pictures',
]) {
  @IsNotEmpty()
  pictures: PublicFile[];
}
