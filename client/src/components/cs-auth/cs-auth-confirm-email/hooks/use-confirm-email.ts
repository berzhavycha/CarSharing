import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useStore } from '@/context';
import { authRedirectPages } from '@/helpers';
import { ConfirmEmailDto } from '@/types';

type HookReturn = {
  expectedErrorMessage: string;
  isLoading: boolean;
};

export const useConfirmEmail = (): HookReturn => {
  const { currentUserStore } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  const token = new URLSearchParams(location.search).get('token');
  const errorMessage = location.state?.errorMessage ?? '';

  useEffect(() => {
    if (token) {
      confirmEmail({ token });
    }
  }, [token]);

  const confirmEmail = async (data: ConfirmEmailDto): Promise<void> => {
    await currentUserStore.confirmEmail(data);
    if (currentUserStore.user) {
      navigate(authRedirectPages[currentUserStore.user.role]);
    }
  };

  const getExpectedErrorMessage = (): string => {
    const errorKeys = Object.keys(currentUserStore.errors.confirmEmail ?? {});
    const firstErrorKey = errorKeys.find((key) => key !== 'unexpectedError');

    if (firstErrorKey) {
      return currentUserStore.errors.confirmEmail?.[
        firstErrorKey as keyof ConfirmEmailDto
      ] as string;
    }

    return currentUserStore.errors.confirmEmail?.unexpectedError || errorMessage || '';
  };

  return { expectedErrorMessage: getExpectedErrorMessage(), isLoading: currentUserStore.isLoading };
};
