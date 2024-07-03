import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchRentalHistory, returnCar } from '@/services';
import { Instance, flow, getParent, types } from 'mobx-state-tree';
import { RentalModel } from '../models';
import { QueryRentalsDto, Rental } from '@/types';
import { CurrentUserStoreType } from './current-user-store';

export const RentalStore = types
  .model('RentalStore', {
    rentals: types.optional(types.array(RentalModel), []),
    refund: types.maybe(types.number),
    penalty: types.maybe(types.number),
    isReturnedInTime: types.optional(types.boolean, false),
    errorMessage: types.optional(types.string, ''),
    potentialRentalPrice: types.optional(types.number, 0)
  })
  .actions((self) => ({
    setPotentialRentalPrice(price: number): void {
      self.potentialRentalPrice = price;
    },
    setRentals(rentals: Rental[]): void {
      self.rentals.replace(rentals.map(rental => RentalModel.create(rental)));
    },
    setRefund(refund?: number): void {
      self.refund = refund;
    },
    setPenalty(penalty?: number): void {
      self.penalty = penalty;
    },
    setErrorMessage(error: string): void {
      self.errorMessage = error;
    },
    setIsReturnedInTime(inTime: boolean): void {
      self.isReturnedInTime = inTime;
    },
    fetchRentals: flow(function* (params: QueryRentalsDto) {
      try {
        const { rentals } = yield fetchRentalHistory(params);
        self.rentals = rentals.map((rental: Rental) => RentalModel.create(rental));
      } catch (error) {
        console.error('Error fetching rentals:', error);
        self.errorMessage = UNEXPECTED_ERROR_MESSAGE;
      }
    }),
    returnCar: flow(function* (id: string) {
      try {
        const { rental, refund, penalty, error } = yield returnCar(id);
        const userStore = (getParent(self) as { currentUserStore: CurrentUserStoreType }).currentUserStore;

        if (userStore.user?.balance) {
          if (refund) {
            self.refund = refund;
            userStore.updateBalance(userStore.user.balance + refund);
          } else if (penalty) {
            self.penalty = penalty;
            userStore.updateBalance(userStore.user.balance - penalty);
          } else if (rental) {
            self.isReturnedInTime = true;
          }
        }

        if (error) {
          self.errorMessage = error;
        }
      } catch (error) {
        console.error('Error returning car:', error);
        self.errorMessage = UNEXPECTED_ERROR_MESSAGE;
      }
    }),
  }));

export interface RentalStoreType extends Instance<typeof RentalStore> { }