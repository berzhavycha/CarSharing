import { Roles } from '@/helpers';

export interface SafeUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  balance?: number;
  role: Roles;
}
