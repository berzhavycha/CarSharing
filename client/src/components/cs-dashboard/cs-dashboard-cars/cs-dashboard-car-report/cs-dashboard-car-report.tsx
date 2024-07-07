import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { Button } from '@/components/cs-common';
import { Env } from '@/core';
import { defaultSearchParams } from '@/helpers';
import { device } from '@/styles';
import { Car } from '@/types';

import { CSCommonTableList } from '../../../cs-common';

import { CSDashboardCarTable } from './cs-dashboard-car-table';

const carsDefaultSearchParams = {
  ...defaultSearchParams,
  limit: Env.ADMIN_CARS_PAGINATION_LIMIT,
};

type LoadedData = {
  cars: Car[];
  count: number;
};

export const CSDashboardCarReport: FC = () => {
  return (
    <CSCommonTableList<LoadedData>
      title="Cars"
      searchPlaceholder="Search by model name"
      defaultSearchParams={carsDefaultSearchParams}
      paginationLimit={Env.ADMIN_CARS_PAGINATION_LIMIT}
      renderTable={(data, onSortChange) => (
        <CSDashboardCarTable cars={data.cars} onSortChange={onSortChange} />
      )}
      extraHeaderContent={
        <ResponsivePrimaryButton as={Link} to="/dashboard/add-car" $style="main">
          Add Car
        </ResponsivePrimaryButton>
      }
    />
  );
};

const ResponsivePrimaryButton = styled(Button)`
  @media ${device.lg} {
    font-size: 14px;
    padding: 8px 16px;
  }

  @media ${device.sm} {
    font-size: 12px;
    padding: 6px 12px;
  }
`;
