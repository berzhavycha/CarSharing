import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { authErrorMessages, PASSWORD_MIN_LENGTH } from '@/helpers';

import { RegisterUserDto } from '../auth';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterUserDto, ['role']),
) {
  @IsOptional()
  readonly picture?: Express.Multer.File;

  @IsNotEmpty()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: authErrorMessages.SMALL_PASSWORD })
  oldPassword?: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: authErrorMessages.SMALL_PASSWORD })
  newPassword?: string;
}
