import { FC, useState } from 'react';

import { CSCommonSearchBar } from '@/components/cs-common';

export const CSHeaderLayoutCarSearch: FC = () => {
  const [carModel, setModel] = useState<string>('');

  return <CSCommonSearchBar search={carModel} onSearchChange={setModel} placeholder='Search car by name' />;
};
