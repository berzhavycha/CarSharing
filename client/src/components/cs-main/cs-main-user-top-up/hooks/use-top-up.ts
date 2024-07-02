import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useStore } from '@/context';
import { UpdateUserBalanceDto } from '@/types';

type HookReturn = {
  isTopUpSuccessful: boolean;
  setIsTopUpSuccessful: Dispatch<SetStateAction<boolean>>;
  unexpectedError: string;
  setUnexpectedError: Dispatch<SetStateAction<string>>;
  onSubmit: (topUpDto: UpdateUserBalanceDto) => Promise<void>;
};

export const useTopUp = (): HookReturn => {
  const {
    currentUserStore: { topUpErrors, topUp },
  } = useStore();

  const [isTopUpSuccessful, setIsTopUpSuccessful] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [unexpectedError, setUnexpectedError] = useState<string>(
    topUpErrors?.unexpectedError ?? '',
  );

  useEffect(() => {
    if (isSubmitted) {
      if (!topUpErrors) {
        setIsTopUpSuccessful(true);
      }
      setIsSubmitted(false);
    }
  }, [isSubmitted, topUpErrors]);

  const onSubmit = async (topUpDto: UpdateUserBalanceDto): Promise<void> => {
    await topUp(topUpDto);
    setIsSubmitted(true);
  };

  return { isTopUpSuccessful, setIsTopUpSuccessful, unexpectedError, setUnexpectedError, onSubmit };
};
