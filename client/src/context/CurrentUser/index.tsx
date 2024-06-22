import { createContext, Dispatch, FC, PropsWithChildren, SetStateAction, useContext } from 'react';

import { User } from '@/types';

import { useFetchCurrentUser } from './hooks';

type ContextType = {
  currentUser: User | null;
  onUserSignOut: () => void;
  setCurrentUser: Dispatch<SetStateAction<User | null>>;
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
  const [currentUser, setCurrentUser] = useFetchCurrentUser();

  const onUserSignOut = (): void => {
    setCurrentUser(null);
  };

  const contextValue: ContextType = {
    currentUser,
    onUserSignOut,
    setCurrentUser
  };

  return <CurrentUserContext.Provider value={contextValue}>{children}</CurrentUserContext.Provider>;
};
