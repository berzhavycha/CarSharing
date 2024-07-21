import { FC } from 'react';

import { CSCommonSearchBar } from '@/components/cs-common';
import { useParamsSearch } from '@/hooks';

export const CSMainLayoutCarSearch: FC = () => {
  const { search, handleInputChange } = useParamsSearch();

  return (
    <CSCommonSearchBar
      search={search}
      onSearchChange={handleInputChange}
      placeholder="Search car by name"
    />
  );
};
