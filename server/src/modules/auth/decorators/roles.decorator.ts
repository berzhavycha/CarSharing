import { CustomDecorator, SetMetadata } from '@nestjs/common';

import { Roles as AvailableRoles } from '@shared';

export const ROLES_KEY = 'role';
export const Roles = (role: AvailableRoles): CustomDecorator<string> =>
  SetMetadata(ROLES_KEY, role);
