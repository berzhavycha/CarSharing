import { RentalModel, RentalType } from '@/app/models';
import { RootStoreType } from '@/app/stores';
import { Rental } from '@/types';

export const findOrCreateRentalModel = (rootStore: RootStoreType, rental: Rental): RentalType => {
  let rentalModel = rootStore.rentalListStore?.rentals.find((rent) => rent.id === rental.id);
  if (rentalModel) {
    rootStore.rentalListStore?.updateRental(rental.id, rental);
  } else {
    rentalModel = RentalModel.create(rental);
    rootStore.rentalListStore?.addRental(rentalModel);
  }
  return rentalModel;
};
