import { UNEXPECTED_ERROR_MESSAGE } from "@/helpers";
import { fetchRentalHistory } from "@/services";
import { Rental, QueryRentalsDto } from "@/types";
import { t, flow } from "mobx-state-tree";
import { RentalModel, RentalType } from "../models";

export const RentalListStore = t
    .model('RentalListStore', {
        rentals: t.optional(t.array(RentalModel), []),
        errorMessage: t.optional(t.string, ''),
    })
    .actions((self) => ({
        setRentals(rentals: Rental[]): void {
            self.rentals.replace(rentals.map((rental) => RentalModel.create(rental)));
        },
        addRental(rental: RentalType): void {
            self.rentals.push(rental);
        },
        setErrorMessage(error: string): void {
            self.errorMessage = error;
        },
    }))
    .actions(self => ({
        fetchRentals: flow(function* (params: QueryRentalsDto) {
            try {
                const { rentals } = yield fetchRentalHistory(params);
                self.setRentals(rentals);
            } catch (error) {
                self.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
            }
        }),
    }))