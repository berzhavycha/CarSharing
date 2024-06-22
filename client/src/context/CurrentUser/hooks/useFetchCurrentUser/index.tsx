import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { axiosInstance } from '@/api';
import { Env } from '@/core';
import { transformUserResponse } from '@/helpers';
import { User } from '@/types';

type HookReturn = [User | null, Dispatch<SetStateAction<User | null>>]

export const useFetchCurrentUser = (): HookReturn => {
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

  return [currentUser, setCurrentUser];
};
