import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Roles } from '../constants';

export class UserDto {
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
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
