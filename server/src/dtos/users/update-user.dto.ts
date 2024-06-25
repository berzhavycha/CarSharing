import { OmitType, PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength } from 'class-validator';

import { authErrorMessages, PASSWORD_MIN_LENGTH } from '@/helpers';

import { RegisterUserDto } from '../auth';

export class UpdateUserDto extends PartialType(
  OmitType(RegisterUserDto, ['role', 'password']),
) {
  @IsOptional()
  readonly picture?: Express.Multer.File;

  @IsOptional()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: authErrorMessages.SMALL_PASSWORD })
  oldPassword?: string;

  @IsOptional()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: authErrorMessages.SMALL_PASSWORD })
  newPassword?: string;
}
