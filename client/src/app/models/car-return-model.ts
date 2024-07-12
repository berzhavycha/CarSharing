import { Rental } from '@/types';
import { t } from 'mobx-state-tree';
import { RentalModel } from './rental-model';

export const CarReturnModel = t
  .model('CarReturnModel', {
    rentalToReturn: t.optional(t.maybeNull(t.reference(RentalModel)), null),
    loading: false,
    refund: t.maybe(t.number),
    penalty: t.maybe(t.number),
    isReturnedInTime: t.optional(t.boolean, false),
    errorMessage: t.optional(t.string, ''),
  })
  .actions((self) => ({
    setRefund(refund?: number): void {
      self.refund = refund;
    },
    setPenalty(penalty?: number): void {
      self.penalty = penalty;
    },
    setIsReturnedInTime(inTime: boolean): void {
      self.isReturnedInTime = inTime;
    },
    setErrorMessage(error: string): void {
      self.errorMessage = error;
    },
    setRentalToReturn(rental: Rental | null): void {
      if (rental) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        self.rentalToReturn = rental.id as any;
      } else {
        self.rentalToReturn = null;
      }
    },
    setLoading(cond: boolean): void {
      self.loading = cond;
    },
  }));
