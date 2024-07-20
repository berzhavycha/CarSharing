import { rootStore } from '@/app/stores';

import { Roles } from '../../constants';
import { AuthenticatedUser } from '@/types';

export const checkUserRole = async (role: Roles): Promise<{
  allowed: boolean,
  user: AuthenticatedUser | null
}> => {
  if (!rootStore.currentUserStore.user) {
    await rootStore.currentUserStore.fetchCurrentUser();
  }

  const user = rootStore.currentUserStore.user

  return {
    allowed: user?.role === role,
    user
  };
};
