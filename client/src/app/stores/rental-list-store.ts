import { applySnapshot, flow, Instance, t } from 'mobx-state-tree';

import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchRentalHistory } from '@/services';
import { QueryRentalsDto, Rental } from '@/types';

import { RentalModel, RentalType } from '../models';

export const RentalListStore = t
  .model('RentalListStore', {
    rentals: t.optional(t.array(RentalModel), []),
    errorMessage: t.optional(t.string, ''),
  })
  .actions((self) => ({
    setRentals(rentals: Rental[]): void {
      self.rentals.replace(rentals.map((rental) => RentalModel.create(rental)));
    },
    addRental(rental: RentalType): void {
      self.rentals.push(rental);
    },
    updateRental(rentalId: string, updatedRental: Rental): void {
      const index = self.rentals.findIndex((rental) => rental.id === rentalId);
      if (index !== -1) {
        applySnapshot(self.rentals[index], updatedRental);
      }
    },
    setErrorMessage(error: string): void {
      self.errorMessage = error;
    },
  }))
  .actions((self) => ({
    fetchRentals: flow(function* (params: QueryRentalsDto) {
      try {
        const { rentals } = yield fetchRentalHistory(params);
        self.setRentals(rentals);
      } catch (error) {
        self.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      }
    }),
  }));

export type RentalListStoreType = Instance<typeof RentalListStore>;
