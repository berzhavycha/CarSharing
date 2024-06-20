import { FC, useState } from 'react';

import { SearchBar } from '@/components/common/SearchBar';

export const CarSearch: FC = () => {
  const [carModel, setModel] = useState<string>('');

  return <SearchBar search={carModel} onSearchChange={setModel} />;
};
