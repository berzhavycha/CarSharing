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
    currentUserStore: { errors, topUp },
  } = useStore();

  const [isTopUpSuccessful, setIsTopUpSuccessful] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [unexpectedError, setUnexpectedError] = useState<string>(
    errors?.topUp?.unexpectedError ?? '',
  );

  useEffect(() => {
    if (isSubmitted) {
      if (!errors?.topUp) {
        setIsTopUpSuccessful(true);
      }
      setIsSubmitted(false);
    }
  }, [isSubmitted, errors?.topUp]);

  const onSubmit = async (topUpDto: UpdateUserBalanceDto): Promise<void> => {
    await topUp(topUpDto);
    setIsSubmitted(true);
  };

  return { isTopUpSuccessful, setIsTopUpSuccessful, unexpectedError, setUnexpectedError, onSubmit };
};
