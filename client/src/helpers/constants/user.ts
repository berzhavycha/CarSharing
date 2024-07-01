import { UpdateUserDto } from '@/types';

export const updateUserFieldMappings: Record<string, keyof UpdateUserDto> = {
  firstname: 'firstName',
  lastname: 'lastName',
  email: 'email',
  'old password': 'oldPassword',
  'new password': 'newPassword',
  image: 'picture',
};
