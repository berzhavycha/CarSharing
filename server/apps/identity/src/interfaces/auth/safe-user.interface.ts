import { Roles } from '@app/shared/helpers/constants/auth';

export interface SafeUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  balance?: number;
  role: Roles;
}
