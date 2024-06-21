import { User } from '@/types';

import { ApiAuthResponse } from '../interfaces';

export const transformUserResponse = (data: ApiAuthResponse): User => {
  return {
    ...data,
    role: data.role.name,
  };
};
