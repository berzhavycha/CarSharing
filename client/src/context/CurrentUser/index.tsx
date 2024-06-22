import { createContext, FC, PropsWithChildren, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { Env } from '@/core';
import { transformUserResponse } from '@/helpers';
import { axiosInstance } from '@/api';

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
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    useEffect(() => {
        const fetchCurrentUser = async (): Promise<void> => {
            try {
                const { data } = await axiosInstance.get(`${Env.API_BASE_URL}/auth/current-user`);
                setCurrentUser(transformUserResponse(data));
            } catch (error) {
                console.error('Failed to fetch current user:', error);
                setCurrentUser(null);
            }
        };

        fetchCurrentUser();
    }, []);

    const onUserSignOut = (): void => {
        setCurrentUser(null);
    };

    const contextValue: ContextType = {
        currentUser,
        onUserSignOut,
    };

    return <CurrentUserContext.Provider value={contextValue}>{children}</CurrentUserContext.Provider>;
};
