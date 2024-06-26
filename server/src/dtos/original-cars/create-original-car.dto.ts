import { OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

import { LocalFile } from '@/entities';

import { CreateCarDto } from '../cars';

export class CreateOriginalCarDto extends OmitType(CreateCarDto, [
  'status', 
]) {
  @IsNotEmpty()
  pictures: LocalFile[];
}
