import { t } from 'mobx-state-tree';

export const CarReturnModel = t
  .model('CarReturnModel', {
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
  }));
