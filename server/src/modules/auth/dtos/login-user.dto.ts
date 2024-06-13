import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { errorMessages, PASSWORD_MIN_LENGTH } from '../constants';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: errorMessages.SMALL_PASSWORD })
  readonly password: string;
}
