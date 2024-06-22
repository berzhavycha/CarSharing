import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { RegisterUserDto } from '../auth';

export class UpdateUserDto extends PartialType(OmitType(RegisterUserDto, ['role'])) {
  @IsOptional()
  readonly picture?: Express.Multer.File;
}
