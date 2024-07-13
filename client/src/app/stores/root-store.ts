import { Instance, t } from 'mobx-state-tree';

import { CurrentUserStore } from './current-user-store';
import { RentalStore } from './rental-store';
import { CarReturnStore } from './car-return-store';
import { RentalListStore } from './rental-list-store';
import { RentalPaymentStore } from './rental-payment-store';
import { SingleRentalStore } from './single-rental-store';

const RootStore = t.model('RootStore', {
  currentUserStore: CurrentUserStore,
  rentalStore: RentalStore,
});


export const rootStore = RootStore.create({
  currentUserStore: CurrentUserStore.create({
    errors: {},
  }),
  rentalStore: RentalStore.create({
    carReturn: CarReturnStore.create({}),
    rentalPayment: RentalPaymentStore.create({}),
    singleRental: SingleRentalStore.create({}),
    rentalList: RentalListStore.create({ rentals: [] }),
  }),
});


export type RootStoreType = Instance<typeof RootStore>;


