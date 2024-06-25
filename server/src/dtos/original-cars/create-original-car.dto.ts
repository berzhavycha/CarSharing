import { OmitType } from '@nestjs/mapped-types';

import { CreateCarDto } from '../cars';
import { LocalFile } from '@/entities';
import { IsNotEmpty } from 'class-validator';

export class CreateOriginalCarDto extends OmitType(CreateCarDto, ['status', 'picture']) {
    @IsNotEmpty()
    picture: LocalFile
}
