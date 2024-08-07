import { flow, getRoot, Instance, t } from 'mobx-state-tree';

import { findOrCreateRentalModel, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { getRental } from '@/services';
import { Rental } from '@/types';

import { RentalModel } from '../models';

import { RootStoreType } from './root-store';

export const SingleRentalStore = t
  .model('SingleRentalStore', {
    rental: t.optional(t.maybeNull(t.safeReference(RentalModel)), null),
    errorMessage: t.optional(t.string, ''),
  })
  .actions((self) => ({
    setRental(rental: Rental | null): void {
      if (rental) {
        const rootStore = getRoot<RootStoreType>(self);
        self.rental = findOrCreateRentalModel(rootStore, rental);
      } else {
        self.rental = null;
      }
    },
    setErrorMessage(error: string): void {
      self.errorMessage = error;
    },
  }))
  .actions((self) => ({
    fetchSingleRental: flow(function* (id: string) {
      self.setErrorMessage('');
      try {
        const data = yield getRental(id);
        self.setRental(data);
      } catch (error) {
        self.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      }
    }),
  }));

export type SingleRentalStoreType = Instance<typeof SingleRentalStore>;
