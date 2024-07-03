import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchRentalHistory, returnCar } from '@/services';
import { Instance, flow, getParent, t } from 'mobx-state-tree';
import { Rental } from '../models/rental-model';
import { QueryRentalsDto, Rental as RentalType } from '@/types';
import { CurrentUserStoreType } from './current-user-store';

export const RentalStore = t
  .model({
    rentals: t.maybe(t.array(Rental)),
    refund: t.maybe(t.number),
    penalty: t.maybe(t.number),
    isReturnedInTime: t.boolean,
    errorMessage: t.string,
    potentialRentalPrice: t.number
  })
  .actions((self) => ({
    setPotentialRentalPrice: (price: number): void => {
      self.potentialRentalPrice = price
    },
    fetchRentals: flow(function* (params: QueryRentalsDto) {
      try {
        const data = yield fetchRentalHistory(params);
        self.rentals = data.rentals.map((rental: RentalType) => Rental.create({...rental}));
      } catch (error) {
        console.log(error)
        self.errorMessage = UNEXPECTED_ERROR_MESSAGE;
      }
    }),
    setRefund: (refund?: number): void => {
      self.refund = refund;
    },
    setPenalty: (penalty?: number): void => {
      self.penalty = penalty;
    },
    setErrorMessage: (error: string): void => {
      self.errorMessage = error;
    },
    setIsReturnedInTime: (inTime: boolean): void => {
      self.isReturnedInTime = inTime;
    },
    returnCar: flow(function* (id) {
      try {
        const { rental, refund, penalty, error } = yield returnCar(id);

        const userStore = (getParent(self) as { currentUserStore: CurrentUserStoreType }).currentUserStore

        if (userStore.user && userStore.user.balance) {
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
        self.errorMessage = UNEXPECTED_ERROR_MESSAGE;
      }
    }),
  }));

export type RentalStoreType = Instance<typeof RentalStore>;
