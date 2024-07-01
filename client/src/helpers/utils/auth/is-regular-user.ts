import { rootStore } from '@/app/stores';

import { Roles } from '../../constants';

export const isRegularUser = async (): Promise<boolean> => {
  if (!rootStore.currentUserStore.user) {
    await rootStore.currentUserStore.fetchCurrentUser();
  }

  return rootStore.currentUserStore.user?.role === Roles.USER;
};
