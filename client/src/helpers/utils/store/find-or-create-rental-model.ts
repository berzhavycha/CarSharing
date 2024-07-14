import { RootStoreType } from "@/app/stores";
import { RentalModel, RentalType } from "@/app/models";
import { Rental } from "@/types";

export const findOrCreateRentalModel = (rootStore: RootStoreType, rental: Rental): RentalType => {
    let rentalModel = rootStore.rentalList?.rentals.find(rent => rent.id === rental.id);
    if (rentalModel) {
        rootStore.rentalList?.updateRental(rental.id, rental);
    } else {
        rentalModel = RentalModel.create(rental);
        rootStore.rentalList?.addRental(rentalModel);
    }
    return rentalModel;
};