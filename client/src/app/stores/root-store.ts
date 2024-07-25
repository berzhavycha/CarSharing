import { castToSnapshot, Instance, t } from 'mobx-state-tree';

import { CarReturnStore } from './car-return-store';
import { CurrentUserStore } from './current-user-store';
import { RentalListStore } from './rental-list-store';
import { RentalPaymentStore } from './rental-payment-store';
import { SingleRentalStore } from './single-rental-store';

export const RootStore = t.model('RootStore', {
  currentUserStore: CurrentUserStore,
  carReturnStore: CarReturnStore,
  rentalPaymentStore: RentalPaymentStore,
  singleRentalStore: SingleRentalStore,
  rentalListStore: RentalListStore,
});

export const rootStore = RootStore.create({
  currentUserStore: CurrentUserStore.create({
    errors: {},
  }),
  carReturnStore: castToSnapshot(CarReturnStore.create({})),
  rentalPaymentStore: RentalPaymentStore.create({}),
  singleRentalStore: castToSnapshot(SingleRentalStore.create({})),
  rentalListStore: RentalListStore.create({ rentals: [] }),
});

export type RootStoreType = Instance<typeof RootStore>;

