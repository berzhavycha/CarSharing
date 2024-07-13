import { UNEXPECTED_ERROR_MESSAGE } from "@/helpers";
import { getRental } from "@/services";
import { Rental } from "@/types";
import { t, flow, getParent } from "mobx-state-tree";
import { RentalModel } from "../models";
import { RootStoreType } from "./root-store";

export const SingleRentalStore = t
    .model('SingleRentalStore', {
        rental: t.maybeNull(RentalModel),
        errorMessage: t.optional(t.string, ''),
    })
    .actions((self) => ({
        setRental(rental: Rental): void {
            if (rental) {
                const rootStore = getParent<RootStoreType>(self, 2);
                const rentalModel = rootStore.rentalStore.rentalList?.rentals.find(rent => rent.id === rental.id);
                if (rentalModel) {
                    self.rental = rentalModel;
                } else {
                    self.rental = RentalModel.create(rental);
                }
            } else {
                self.rental = null;
            }
        },
        setErrorMessage(error: string): void {
            self.errorMessage = error;
        },
    }))
    .actions(self => ({
        fetchSingleRental: flow(function* (id: string) {
            self.setErrorMessage('');
            try {
                const data = yield getRental(id);
                self.setRental(data);
            } catch (error) {
                self.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            }
        }),
    }))