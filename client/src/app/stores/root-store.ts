import { Instance, t } from 'mobx-state-tree';

import { CurrentUserStore } from './current-user-store';
import { RentalStore } from './rental-store';

const RootStore = t.model('RootStore', {
  currentUserStore: CurrentUserStore,
  rentalStore: RentalStore,
});

export const rootStore = RootStore.create({
  currentUserStore: CurrentUserStore.create({
    errors: {},
  }),
  rentalStore: RentalStore.create(),
});

export type RootStoreType = Instance<typeof RootStore>;
