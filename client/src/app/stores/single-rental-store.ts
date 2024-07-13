import { UNEXPECTED_ERROR_MESSAGE } from "@/helpers";
import { getRental } from "@/services";
import { t, flow, getRoot } from "mobx-state-tree";
import { RentalType } from "../models";
import { RootStoreType } from "./root-store";

export const SingleRentalStore = t
    .model('SingleRentalStore', {
        rentalId: t.maybeNull(t.string),
        errorMessage: t.optional(t.string, ''),
    })
    .views(self => ({
        get rental(): RentalType | null | undefined {
            const rentalStore = getRoot<RootStoreType>(self).rentalStore;
            return self.rentalId
                ? rentalStore.rentalList.rentals.find(rental => rental.id === self.rentalId)
                : null;
        }
    }))
    .actions((self) => ({
        setRentalId(id: string): void {
            self.rentalId = id
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
                self.setRentalId(data.id);
            } catch (error) {
                self.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            }
        }),
    }))