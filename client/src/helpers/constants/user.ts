import { UpdateUserBalanceDto, UpdateUserDto } from '@/types';

export const updateUserFieldMappings: Record<string, keyof UpdateUserDto> = {
  firstname: 'firstName',
  lastname: 'lastName',
  email: 'email',
  'old password': 'oldPassword',
  'new password': 'newPassword',
  image: 'picture',
};

export const updateUserBalanceFieldMappings: Record<string, keyof UpdateUserBalanceDto> = {
  amount: 'amount',
};
