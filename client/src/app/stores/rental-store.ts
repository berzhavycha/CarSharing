import { Instance, types as t } from 'mobx-state-tree';

export const Rental = t.model('Rental', {
  price: t.number,
});

export const RentalStore = t
  .model('RentalStore', {
    rental: t.optional(t.maybeNull(Rental), null),
  })
  .actions((self) => ({
    setRental: (rental: { price: number }): void => {
      self.rental = rental;
    },
    updatePrice: (price: number): void => {
      if (self.rental) {
        self.rental.price = price;
      }
    },
  }));

export type RentalStoreType = Instance<typeof RentalStore>;
