import { Roles } from '@/helpers';
import { PaymentDto } from './payment';
import { PublicFile } from './public-files';

export type AuthenticatedUser = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  balance: number | null;
  role: Roles;
  avatar: PublicFile;
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
