import { Instance, t } from 'mobx-state-tree';

import { CurrentUserStore } from './CurrentUserStore';

const RootStore = t.model('RootStore', {
  currentUserStore: CurrentUserStore,
});

export const rootStore = RootStore.create({
  currentUserStore: CurrentUserStore.create({}),
});

export type RootStoreType = Instance<typeof RootStore>;
