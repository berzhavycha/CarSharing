import { useCallback } from 'react';

type HookReturn = {
  preventNegativeInput: (event: React.KeyboardEvent<HTMLInputElement>) => void;
};

export const useNonNegativeInput = (): HookReturn => {
  const preventNegativeInput = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '-' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }, []);

  return {
    preventNegativeInput,
  };
};
