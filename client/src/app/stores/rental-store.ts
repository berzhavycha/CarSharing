import { Instance, t } from 'mobx-state-tree';
import { CarReturnStore } from './car-return-store';
import { RentalListStore } from './rental-list-store';
import { RentalPaymentStore } from './rental-payment-store';
import { SingleRentalStore } from './single-rental-store';

export const RentalStore = t
  .model('RentalStore', {
    carReturn: CarReturnStore,
    rentalPayment: RentalPaymentStore,
    singleRental: SingleRentalStore,
    rentalList: RentalListStore,
  })

export interface RentalStoreType extends Instance<typeof RentalStore> { }
