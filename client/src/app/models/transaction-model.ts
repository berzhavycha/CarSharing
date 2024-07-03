import { t } from "mobx-state-tree";
import { User } from "./user-model";
import { Rental } from "./rental-model";

export const Transaction = t.model({
    id: t.identifier,
    amount: t.number,
    type: t.string,
    user: User,
    rental: t.late(() => Rental),
    createdAt: t.string,
});
