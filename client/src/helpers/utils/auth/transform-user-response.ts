import { AuthenticatedUser } from '@/types';

import { ApiAuthResponse } from '../../interfaces';
import { Roles } from '@/helpers/constants';

export const transformUserResponse = (data: ApiAuthResponse): AuthenticatedUser => {
  return {
    ...data,
    role: data.role.name as Roles,
  };
};
