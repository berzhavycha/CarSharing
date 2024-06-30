import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import { CSDashboardListView } from '../../cs-dashboard-list-view';
import { Env } from '@/core';
import { defaultSearchParams } from '@/helpers';
import { CSDashboardCarTable } from './cs-dashboard-car-table';
import { CSCommonPrimaryButton } from '@/components/cs-common';
import { Car } from '@/types';

const carsDefaultSearchParams = {
  ...defaultSearchParams,
  limit: Env.ADMIN_CARS_PAGINATION_LIMIT,
};

type LoadedData = {
  cars: Car[],
  count: number
}

export const CSDashboardCarReport: FC = () => {
  const navigate = useNavigate();

  const onAddBtnClick = (): void => navigate('/dashboard/add-car');

  return (
    <CSDashboardListView<LoadedData>
      title="Cars"
      searchPlaceholder="Search by model name"
      defaultSearchParams={carsDefaultSearchParams}
      paginationLimit={Env.ADMIN_CARS_PAGINATION_LIMIT}
      renderTable={(data, onSortChange) => (
        <CSDashboardCarTable cars={data.cars} onSortChange={onSortChange} />
      )}
      extraHeaderContent={
        <CSCommonPrimaryButton onClick={onAddBtnClick} content="Add Car" />
      }
    />
  );
};