import { Roles } from '@shared';

export interface SafeUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  balance?: number;
  role: Roles;
}
