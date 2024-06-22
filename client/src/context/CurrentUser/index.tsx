import { createContext, FC, PropsWithChildren, useContext } from 'react';

import { User } from '@/types';

import { useFetchCurrentUser } from './hooks';

type ContextType = {
  currentUser: User | null;
  onUserSignOut: () => void;
};

const CurrentUserContext = createContext<ContextType | undefined>(undefined);

export const useCurrentUser = (): ContextType => {
  const context = useContext(CurrentUserContext);
  if (context === undefined) {
    throw new Error('useCurrentUser must be used within a CurrentUserProvider');
  }
  return context;
};

export const CurrentUserProvider: FC<PropsWithChildren> = ({ children }) => {
  const [currentUser, onUserSignOut] = useFetchCurrentUser();

  const contextValue: ContextType = {
    currentUser,
    onUserSignOut,
  };

  return <CurrentUserContext.Provider value={contextValue}>{children}</CurrentUserContext.Provider>;
};
