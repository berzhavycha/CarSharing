import { t } from "mobx-state-tree";
import { OriginalCar } from "./original-car-model";
import { Transaction } from "./transaction-model";

export const Rental = t.model({
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
    originalCar: t.late(() => OriginalCar),
    transactions: t.array(t.late(() => Transaction)),
});