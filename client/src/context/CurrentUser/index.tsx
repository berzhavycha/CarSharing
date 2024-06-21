import {
    createContext,
    FC,
    PropsWithChildren,
    useContext,
} from 'react';
import { useFetchCurrentUser } from './hooks';
import { User } from '@/types';

type ContextType = {
    currentUser: User | null;
    onUserSignOut: () => void
};

const CurrentUserContext = createContext<ContextType | null>(null);

export const useCurrentUser = (): ContextType => {
    const userContext = useContext(CurrentUserContext);

    if (!userContext) {
        throw new Error('useCurrentUser must be used within an CurrentUserProvider');
    }

    return userContext;
};

export const CurrentUserProvider: FC<PropsWithChildren> = ({ children }) => {
    const { user, setUser } = useFetchCurrentUser()

    const onUserSignOut = (): void => {
        setUser(null)
    }

    const contextValue: ContextType = {
        currentUser: user,
        onUserSignOut
    };

    return <CurrentUserContext.Provider value={contextValue}>{children}</CurrentUserContext.Provider>;
};