import { castToSnapshot, Instance, t } from 'mobx-state-tree';

import { CarReturnStore } from './car-return-store';
import { CurrentUserStore } from './current-user-store';
import { RentalListStore } from './rental-list-store';
import { RentalPaymentStore } from './rental-payment-store';
import { SingleRentalStore } from './single-rental-store';

const RootStore = t.model('RootStore', {
  currentUserStore: CurrentUserStore,
  carReturn: CarReturnStore,
  rentalPayment: RentalPaymentStore,
  singleRental: SingleRentalStore,
  rentalList: RentalListStore,
});

export const rootStore = RootStore.create({
  currentUserStore: CurrentUserStore.create({
    errors: {},
  }),
  carReturn: castToSnapshot(CarReturnStore.create({})),
  rentalPayment: RentalPaymentStore.create({}),
  singleRental: castToSnapshot(SingleRentalStore.create({})),
  rentalList: RentalListStore.create({ rentals: [] }),
});

export type RootStoreType = Instance<typeof RootStore>;
