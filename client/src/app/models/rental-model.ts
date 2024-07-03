import { Instance, t } from "mobx-state-tree";
import { Car, OriginalCar, Transaction } from "@/types";

export const RentalModel = t.model('RentalModel', {
    id: t.identifier,
    rentalStart: t.string,
    rentalEnd: t.maybeNull(t.string),
    totalPrice: t.number,
    requestedHours: t.number,
    pickUpLocation: t.string,
    dropOffLocation: t.string,
    status: t.enumeration("RentalStatus", ["active", "closed", "cancelled"]),
    createdAt: t.string,
    updatedAt: t.string,
    car: t.frozen<Car>(),
    originalCar: t.frozen<OriginalCar>(),
    transactions: t.array(t.frozen<Transaction>()),
});

export interface RentalType extends Instance<typeof RentalModel> { }