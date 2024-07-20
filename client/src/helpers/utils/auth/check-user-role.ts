import { rootStore } from '@/app/stores';
import { AuthenticatedUser } from '@/types';

import { Roles } from '../../constants';

export const checkUserRole = async (
  role: Roles,
): Promise<{
  allowed: boolean;
  user: AuthenticatedUser | null;
}> => {
  if (!rootStore.currentUserStore.user) {
    await rootStore.currentUserStore.fetchCurrentUser();
  }

  const user = rootStore.currentUserStore.user;

  return {
    allowed: user?.role === role,
    user,
  };
};
