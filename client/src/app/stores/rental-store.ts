import { flow, getParent, Instance, t } from 'mobx-state-tree';

import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchRentalHistory, getRental, returnCar } from '@/services';
import { QueryRentalsDto, Rental } from '@/types';

import { CarReturnModel, RentalModel, RentalPaymentModel, SingleRentalModel } from '../models';

import { CurrentUserStoreType } from './current-user-store';

export const RentalStore = t
  .model('RentalStore', {
    rentals: t.optional(t.array(RentalModel), []),
    carReturn: t.optional(CarReturnModel, {}),
    rentalPayment: t.optional(RentalPaymentModel, {}),
    singleRental: t.optional(SingleRentalModel, {}),
    errorMessage: t.optional(t.string, ''),
  })
  .actions((self) => ({
    setRentals(rentals: Rental[]): void {
      self.rentals.replace(rentals.map((rental) => RentalModel.create(rental)));
    },
  }))
  .actions((self) => ({
    fetchSingleRental: flow(function* (id: string) {
      self.singleRental.setErrorMessage('');

      try {
        const data = yield getRental(id);
        self.singleRental.setRental(data);
      } catch (error) {
        self.singleRental.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      }
    }),

    fetchRentals: flow(function* (params: QueryRentalsDto) {
      try {
        const { rentals } = yield fetchRentalHistory(params);
        self.setRentals(rentals);
      } catch (error) {
        self.errorMessage = UNEXPECTED_ERROR_MESSAGE;
      }
    }),

    returnCar: flow(function* (id: string) {
      try {
        const { rental, refund, penalty, error } = yield returnCar(id);
        const userStore = (getParent(self) as { currentUserStore: CurrentUserStoreType })
          .currentUserStore;

        if (userStore.user?.balance) {
          if (refund) {
            self.carReturn.setRefund(refund);
            userStore.updateBalance(userStore.user.balance + refund);
          } else if (penalty) {
            self.carReturn.setPenalty(penalty);
            userStore.updateBalance(userStore.user.balance - penalty);
          } else if (rental) {
            self.carReturn.setIsReturnedInTime(true);
          }
        }

        if (error) {
          self.carReturn.setErrorMessage(error);
        }
      } catch (error) {
        self.carReturn.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      }
    }),
  }));

export interface RentalStoreType extends Instance<typeof RentalStore> { }
