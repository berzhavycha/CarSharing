import { Rental } from "@/types";
import { t } from "mobx-state-tree";
import { RentalModel } from "./rental-model";

export const SingleRentalModel = t
    .model('SingleRentalModel', {
        rental: t.optional(t.maybeNull(RentalModel), null),
        errorMessage: t.optional(t.string, ''),
    })
    .actions((self) => ({
        setRental(rental: Rental): void {
            self.rental = RentalModel.create(rental);
        },
        setErrorMessage(error: string): void {
            self.errorMessage = error;
        },
    }));