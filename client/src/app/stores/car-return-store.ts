import { flow, getRoot, t } from 'mobx-state-tree';

import { findOrCreateRentalModel, RentalReturnOrigin, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { returnCar } from '@/services';
import { Rental } from '@/types';

import { RentalModel } from '../models';

import { RootStoreType } from './root-store';

export const CarReturnStore = t
  .model('CarReturnStore', {
    rentalToReturn: t.optional(t.maybeNull(t.late(() => t.reference(RentalModel))), null),
    loading: t.optional(t.boolean, false),
    refund: t.optional(t.maybe(t.number), undefined),
    penalty: t.optional(t.maybe(t.number), undefined),
    isReturnedInTime: t.optional(t.boolean, false),
    errorMessage: t.optional(t.string, ''),
    origin: t.optional(
      t.enumeration('ReturnOrigin', [RentalReturnOrigin.TABLE, RentalReturnOrigin.SINGLE_PAGE]),
      RentalReturnOrigin.TABLE,
    ),
  })
  .actions((self) => ({
    setRentalToReturn(rental: Rental | null): void {
      if (rental) {
        const rootStore = getRoot<RootStoreType>(self);
        self.rentalToReturn = findOrCreateRentalModel(rootStore, rental);
      } else {
        self.rentalToReturn = null;
      }
    },
    setLoading(loading: boolean): void {
      self.loading = loading;
    },
    setRefund(refund: number | undefined): void {
      self.refund = refund;
    },
    setPenalty(penalty: number | undefined): void {
      self.penalty = penalty;
    },
    setIsReturnedInTime(inTime: boolean): void {
      self.isReturnedInTime = inTime;
    },
    setErrorMessage(error: string): void {
      self.errorMessage = error;
    },
    setOrigin(origin: RentalReturnOrigin): void {
      self.origin = origin;
    },
  }))
  .actions((self) => ({
    returnCar: flow(function* (id: string) {
      try {
        self.setLoading(true);
        const { rental, refund, penalty, error } = yield returnCar(id);
        const userStore = getRoot<RootStoreType>(self).currentUserStore;

        if (userStore.user?.balance) {
          if (refund) {
            self.setRefund(refund);
            userStore.updateBalance(userStore.user.balance + refund);
          } else if (penalty) {
            self.setPenalty(penalty);
            userStore.updateBalance(userStore.user.balance - penalty);
          } else if (rental) {
            self.setIsReturnedInTime(true);
          }
        }

        if (error) {
          self.setErrorMessage(error);
        }
      } catch (error) {
        self.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      } finally {
        self.setLoading(false);
        self.setRentalToReturn(null);
      }
    }),
  }));
