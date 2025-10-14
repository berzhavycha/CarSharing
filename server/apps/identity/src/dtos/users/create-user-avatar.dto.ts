import { IsNotEmpty, IsUrl, IsUUID } from 'class-validator';

export class CreateUserAvatarDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  fileId: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;
}
