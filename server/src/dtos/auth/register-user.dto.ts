import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';

import { authErrorMessages, PASSWORD_MIN_LENGTH, Roles } from '@/helpers';

export class RegisterUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: authErrorMessages.SMALL_PASSWORD })
  readonly password: string;

  @IsNotEmpty()
  @IsString()
  readonly firstName: string;

  @IsNotEmpty()
  @IsString()
  readonly lastName: string;

  @IsNotEmpty()
  @IsEnum(Roles)
  readonly role: Roles;
}
