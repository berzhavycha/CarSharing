import { RootStoreType, RootStore } from "@/app/stores";
import { SnapshotIn } from "mobx-state-tree";

export function makeRootStore(partialSnapshot: Partial<SnapshotIn<typeof RootStore>> = {}): RootStoreType {
    const fullSnapshot: SnapshotIn<typeof RootStore> = {
        currentUserStore: { errors: {} },
        carReturnStore: {},
        rentalPaymentStore: {},
        singleRentalStore: {},
        rentalListStore: { rentals: [] },
        ...partialSnapshot,
    };

    return RootStore.create(fullSnapshot);
}