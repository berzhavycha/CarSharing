import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchRentalHistory, getRental, returnCar } from '@/services';
import { Instance, flow, getParent, t } from 'mobx-state-tree';
import { CarReturnModel, RentalModel, RentalPaymentModel, SingleRentalModel } from '../models';
import { QueryRentalsDto, Rental } from '@/types';
import { CurrentUserStoreType } from './current-user-store';

export const RentalStore = t
  .model('RentalStore', {
    rentals: t.optional(t.array(RentalModel), []),
    carReturn: t.optional(CarReturnModel, {}),
    rentalPayment: t.optional(RentalPaymentModel, {}),
    singleRental: t.optional(SingleRentalModel, {}),
  })
  .actions(self => ({
    setRentals(rentals: Rental[]): void {
      self.rentals.replace(rentals.map(rental => RentalModel.create(rental)));
    }
  }))
  .actions((self) => ({
    fetchSingleRental: flow(function* (id: string) {
      try {
        const data = yield getRental(id);
        self.singleRental.setRental(data);
        self.singleRental.setErrorMessage('');
      } catch (error) {
        self.singleRental.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      }
    }),

    fetchRentals: flow(function* (params: QueryRentalsDto) {
      try {
        const { rentals } = yield fetchRentalHistory(params);
        self.setRentals(rentals);
      } catch (error) {
        self.carReturn.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
      }
    }),

    returnCar: flow(function* (id: string) {
      try {
        const { rental, refund, penalty, error } = yield returnCar(id);
        const userStore = (getParent(self) as { currentUserStore: CurrentUserStoreType }).currentUserStore;

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