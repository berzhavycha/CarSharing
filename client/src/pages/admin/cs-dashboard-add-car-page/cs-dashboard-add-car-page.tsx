import { FC } from 'react';

import { CSDashboardCarForm } from '@/components';
import { addNewCar } from '@/services';

export const CSDashboardAddCarPage: FC = () => {
  return <CSDashboardCarForm onFormSubmit={addNewCar} />;
};
