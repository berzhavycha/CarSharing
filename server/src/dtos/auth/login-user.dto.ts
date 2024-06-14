import { authErrorMessages, PASSWORD_MIN_LENGTH } from '@helpers';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class LoginUserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(PASSWORD_MIN_LENGTH, { message: authErrorMessages.SMALL_PASSWORD })
  readonly password: string;
}
