import { OmitType } from '@nestjs/mapped-types';

import { CreateCarDto } from '../cars';

export class CreateOriginalCarDto extends OmitType(CreateCarDto, ['status']) {}
