import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';

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
  const [lastAmount, setLastAmount] = useState<number | null>(null);

  const idempotencyKeyRef = useRef<string>(crypto.randomUUID());

  useEffect(() => {
    if (isSubmitted) {
      if (!errors?.topUp) {
        setIsTopUpSuccessful(true);
        idempotencyKeyRef.current = crypto.randomUUID();
        setLastAmount(null);
      }
      setIsSubmitted(false);
    }
  }, [isSubmitted, errors?.topUp]);

  const onSubmit = async (topUpDto: UpdateUserBalanceDto): Promise<void> => {
    if (topUpDto.amount !== lastAmount) {
      idempotencyKeyRef.current = crypto.randomUUID();
      setLastAmount(topUpDto.amount);
    }

    await topUp(topUpDto, idempotencyKeyRef.current);
    setIsSubmitted(true);
  };

  return { isTopUpSuccessful, setIsTopUpSuccessful, unexpectedError, setUnexpectedError, onSubmit };
};
