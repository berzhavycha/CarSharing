import { OrderOptions } from '@/helpers';

import { useSearchParamsWithDefaults } from './use-search-params-with-defaults';

type HookReturn = {
  onPageChange: (newPage: number) => void;
  onSearchChange: (search: string) => void;
  onSortChange: (sort: string) => void;
};

export const usePagination = (defaultParams?: Record<string, string>): HookReturn => {
  const { searchParams, setParams } = useSearchParamsWithDefaults(defaultParams);

  const onPageChange = (newPage: number): void => setParams({ page: String(newPage) });
  const onSearchChange = (search: string): void => setParams({ search, page: '1' });
  const onSortChange = (sort: string): void => {
    const currentOrder = searchParams.get('order') ?? OrderOptions.ASC;
    const newOrder = currentOrder === OrderOptions.ASC ? OrderOptions.DESC : OrderOptions.ASC;
    setParams({ sort, order: newOrder, page: '1' });
  };

  return { onPageChange, onSearchChange, onSortChange };
};
