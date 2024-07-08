import { rootStore } from '@/app/stores';

import { Roles } from '../../constants';

export const checkUserRole = async (role: Roles): Promise<boolean> => {
  if (!rootStore.currentUserStore.user) {
    await rootStore.currentUserStore.fetchCurrentUser();
  }
  return rootStore.currentUserStore.user?.role === role;
};