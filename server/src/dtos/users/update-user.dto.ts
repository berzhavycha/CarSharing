import { PartialType, OmitType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { RegisterUserDto } from '../auth';
import { PASSWORD_MIN_LENGTH, authErrorMessages } from '@/helpers';

export class UpdateUserDto extends PartialType(OmitType(RegisterUserDto, ['role'])) {
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
