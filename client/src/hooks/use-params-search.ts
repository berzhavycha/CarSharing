import { useEffect, useState } from 'react';

import { DEBOUNCE_DELAY } from '@/helpers';

import { useDebounce } from './use-debounce';
import { usePagination } from './use-pagination';
import { useSearchParamsWithDefaults } from './use-search-params-with-defaults';

type HookReturn = {
  search: string;
  handleInputChange: (text: string) => void;
};

export const useParamsSearch = (key: string = 'search'): HookReturn => {
  const { searchParams } = useSearchParamsWithDefaults();
  const { onSearchChange: handleSearchChange } = usePagination();

  const [search, setSearch] = useState(searchParams.get(key) ?? '');

  const debouncedSearchChange = useDebounce((text: string) => {
    handleSearchChange(text);
  }, DEBOUNCE_DELAY);

  const handleInputChange = (text: string): void => {
    setSearch(text);
    debouncedSearchChange(text);
  };

  useEffect(() => {
    setSearch(searchParams.get(key) ?? '');
  }, [searchParams]);

  return {
    search,
    handleInputChange,
  };
};
