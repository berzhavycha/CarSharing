import { Roles } from '@/helpers/constants';
import { AuthenticatedUser } from '@/types';

import { ApiAuthResponse } from '../../interfaces';

export const transformUserResponse = (data: ApiAuthResponse): AuthenticatedUser => {
  return {
    ...data,
    role: data.role.name as Roles,
  };
};
