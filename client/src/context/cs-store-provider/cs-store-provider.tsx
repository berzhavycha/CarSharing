import { createContext, FC, PropsWithChildren, useContext, useEffect } from 'react';

import { rootStore, RootStoreType } from '@/app/stores';

type ContextType = RootStoreType;

const StoreContext = createContext<ContextType | undefined>(undefined);

export const useStore = (): ContextType => {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreContext');
  }
  return context;
};

export const CSStoreProvider: FC<PropsWithChildren> = ({ children }) => {
  useEffect(() => {
    rootStore.currentUserStore.fetchCurrentUser();
  }, []);

  return <StoreContext.Provider value={rootStore}>{children}</StoreContext.Provider>;
};
