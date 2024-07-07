import { t } from 'mobx-state-tree';

export const RentalPaymentModel = t
  .model('RentalPaymentModel', {
    potentialRentalPrice: t.optional(t.number, 0),
  })
  .actions((self) => ({
    setPotentialRentalPrice(price: number): void {
      self.potentialRentalPrice = price;
    },
  }));
