import { t } from "mobx-state-tree";

export const RentalPaymentStore = t
    .model('RentalPaymentStore', {
        potentialRentalPrice: t.optional(t.number, 0),
    })
    .actions((self) => ({
        setPotentialRentalPrice(price: number): void {
            self.potentialRentalPrice = price;
        },
    }));
