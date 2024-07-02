import { FC } from 'react';
import styled from 'styled-components';

import { AvailableCarsLoaderData } from '@/pages';
import { CSCommonCheckboxFilter, CSCommonRangeFilter } from '@/components/cs-common';
import { MIN_PRICE, PRICE_ROUNDING_INTERVAL } from '@/helpers';
import { CSMainAvailableCarsSort } from './cs-main-available-cars-sort';

type Props = {
  data: AvailableCarsLoaderData['filterOptions'];
};

export const CSMainAvailableCarsFilter: FC<Props> = ({ data }) => {
  const typeOptions = data.types;
  const capacityOptions = data.capacities.map((item) => ({
    ...item,
    label: `${item.label} People`,
    originalValue: item.label,
  }));


  return (
    <SidebarContainer>
      <CSCommonCheckboxFilter type='types[]' options={typeOptions} title='TYPE' />
      <CSCommonCheckboxFilter type='capacities[]' options={capacityOptions} title='CAPACITY' />
      <CSCommonRangeFilter
        title={'PRICE / HOUR'}
        min={MIN_PRICE}
        max={data.maxPrice}
        roundingInterval={PRICE_ROUNDING_INTERVAL}
        minParam='minPrice'
        maxParam='maxPrice'
      />
      <CSMainAvailableCarsSort />
    </SidebarContainer>
  );
};

const SidebarContainer = styled.div`
  flex: 0 0 24%;
  padding: 35px;
  background-color: white;
  min-height: 100%;
  margin-top: 5px;
`;

