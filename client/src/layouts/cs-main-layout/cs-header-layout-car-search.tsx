import { FC } from 'react';

import { CSCommonSearchBar } from '@/components/cs-common';
import { usePagination, useSearchParamsWithDefaults } from '@/hooks';

export const CSHeaderLayoutCarSearch: FC = () => {
  const { searchParams } = useSearchParamsWithDefaults();
  const { onSearchChange } = usePagination();


  return (
    <CSCommonSearchBar
      search={searchParams.get('search') ?? ''}
      onSearchChange={onSearchChange}
      placeholder="Search car by name"
    />
  );
};
