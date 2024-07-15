import { PaymentDto } from './payment';
import { LocalFile } from './local-files';
import { Roles } from '@/helpers';

export type AuthenticatedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number | null;
  role: Roles;
  avatar: LocalFile;
  avatarId: string | null;
};

export type UpdateUserDto = Partial<{
  firstName: string;
  lastName: string;
  email: string;
  picture: false | File | null | FileList;
  newPassword: string;
  oldPassword: string;
  existingImagesIds: string[];
}>;

export type UpdateUserBalanceDto = PaymentDto & {
  amount: number;
};
