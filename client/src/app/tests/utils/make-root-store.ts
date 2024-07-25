import { SnapshotIn } from 'mobx-state-tree';

import { RootStore, RootStoreType } from '@/app/stores';

export function makeRootStore(
  partialSnapshot: Partial<SnapshotIn<typeof RootStore>> = {},
): RootStoreType {
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
