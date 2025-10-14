import { applySnapshot, flow, Instance, t } from 'mobx-state-tree';

import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { fetchRentalHistory } from '@/services';
import { QueryRentalsDto, Rental } from '@/types';

import { RentalModel, RentalType } from '../models';

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
    updateRental(rentalId: string, updatedRental: Rental): void {
      const index = self.rentals.findIndex((rental) => rental.id === rentalId);
      if (index !== -1) {
        applySnapshot(self.rentals[index], updatedRental);
      }
    },
    setErrorMessage(error: string): void {
      self.errorMessage = error;
    },
  }))
  .actions((self) => ({
    fetchRentals: flow(function* (params: QueryRentalsDto) {
  try {
    const { rentals } = yield fetchRentalHistory(params);
    self.setRentals(
      rentals.map((r) => ({
        id: r.id,
        rentalStart: r.rentalStart,
        rentalEnd: r.rentalEnd ?? null,
        totalPrice: r.totalPrice,
        requestedHours: r.requestedHours,
        pickUpLocation: r.pickUpLocation,
        dropOffLocation: r.dropOffLocation,
        status: r.status.toLowerCase(),
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        transactions:
          Array.isArray(r.transactions) && r.transactions.length > 0
            ? r.transactions
                .filter((t) => t && typeof t === 'object' && t.id)
                .map((t) => ({
                  id: t.id,
                  amount: t.amount,
                  paymentMethod: t.paymentMethod,
                  createdAt: t.createdAt,
                  status: t.status,
                }))
            : [],
        car: r.car
  ? {
      id: r.car.id,
      model: r.car.model,
      year: r.car.year,
      description: r.car.description,
      pricePerHour: r.car.pricePerHour,
      type: r.car.type,
      status: r.car.status,
      capacity: r.car.capacity,
      fuelType: r.car.fuelType,
      steering: r.car.steering,
      fuelCapacity: r.car.fuelCapacity,
      pictures: r.car.pictures ?? [],
    }
  : { id: r.carId, pictures: [], model: '', year: 0, description: '', pricePerHour: 0, type: '', status: '', capacity: 0, fuelType: '', steering: '', fuelCapacity: 0 },

originalCar: r.car
  ? {
      id: r.car.id,
      model: r.car.model,
      year: r.car.year,
      description: r.car.description,
      pricePerHour: r.car.pricePerHour,
      type: r.car.type,
      capacity: r.car.capacity,
      fuelType: r.car.fuelType,
      steering: r.car.steering,
      fuelCapacity: r.car.fuelCapacity,
      pictures: r.car.pictures ?? [],
    }
  : { id: r.carId, pictures: [], model: '', year: 0, description: '', pricePerHour: 0, type: '', capacity: 0, fuelType: '', steering: '', fuelCapacity: 0 },

      }))
    );
  } catch (error) {
    self.setErrorMessage(UNEXPECTED_ERROR_MESSAGE);
  }
}),


  }));

export type RentalListStoreType = Instance<typeof RentalListStore>;
