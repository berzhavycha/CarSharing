import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchRentalHistory, getRental, returnCar } from '@/services';
import { Instance, flow, getParent, t } from 'mobx-state-tree';
import { RentalModel } from '../models';
import { QueryRentalsDto, Rental } from '@/types';
import { CurrentUserStoreType } from './current-user-store';

export const RentalStore = t
  .model('RentalStore', {
    rentals: t.optional(t.array(RentalModel), []),
    refund: t.maybe(t.number),
    penalty: t.maybe(t.number),
    isReturnedInTime: t.optional(t.boolean, false),
    errorMessage: t.optional(t.string, ''),
    potentialRentalPrice: t.optional(t.number, 0),
    singleRental: t.optional(t.maybeNull(RentalModel), null),
    singleRentalErrorMessage: t.optional(t.string, ''),
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
    setSingleRental(rental: Rental): void {
      self.singleRental = RentalModel.create(rental)
    },
    fetchSingleRental: flow(function* (id: string) {
      try {
        const data = yield getRental(id);
        self.singleRental = RentalModel.create(data);
      } catch (error) {
        self.singleRentalErrorMessage = UNEXPECTED_ERROR_MESSAGE;
      }
    }),
    fetchRentals: flow(function* (params: QueryRentalsDto) {
      try {
        const { rentals } = yield fetchRentalHistory(params);
        self.rentals = rentals.map((rental: Rental) => RentalModel.create(rental));
      } catch (error) {
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
        self.errorMessage = UNEXPECTED_ERROR_MESSAGE;
      }
    }),
  }));

export interface RentalStoreType extends Instance<typeof RentalStore> { }