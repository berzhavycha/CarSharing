import { useStore } from '@/context';
import { Env } from '@/core';
import { extractPaginationParams } from '@/helpers';

type HookReturn = {
  refetchRentals: () => Promise<void>;
};

export const useRentals = (): HookReturn => {
  const {
    rentalStore: { fetchRentals },
  } = useStore();

  const refetchRentals = async (): Promise<void> => {
    const url = new URL(window.location.href);
    const { queryDto } = extractPaginationParams(url, Env.USER_RENTAL_HISTORY_PAGINATION_LIMIT);

    await fetchRentals(queryDto);
  };

  return { refetchRentals };
};
