import { Instance, t } from 'mobx-state-tree';

import { CurrentUserStore } from './current-user-store';
import { RentalStore } from './rental-store';

const RootStore = t.model('RootStore', {
  currentUserStore: CurrentUserStore,
  rentalStore: RentalStore,
});

export const rootStore = RootStore.create({
  currentUserStore: CurrentUserStore.create({}),
  rentalStore: RentalStore.create({
    rentals: undefined,
    refund: undefined,
    penalty: undefined,
    isReturnedInTime: false,
    errorMessage: '',
    potentialRentalPrice: 0
  }),
});

export type RootStoreType = Instance<typeof RootStore>;
