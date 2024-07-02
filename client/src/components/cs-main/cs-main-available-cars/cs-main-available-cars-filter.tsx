import { FC, useState } from 'react';
import styled from 'styled-components';

import { AvailableCarsLoaderData } from '../../../pages/user/cs-main-available-cars-page/loader';
import { CSMainAvailableCarsCheckboxList, SectionTitle } from './cs-main-available-cars-checkbox-list';
import { CSCommonRangeSlider } from '@/components/cs-common';

type Props = {
  data: AvailableCarsLoaderData['filterOptions'];
};

export const CSMainAvailableCarsFilter: FC<Props> = ({ data }) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100]);

  const typeOptions = data.types;
  const capacityOptions = data.capacities.map((item) => ({
    ...item,
    label: `${item.label} People`,
    originalValue: item.label,
  }));

  return (
    <SidebarContainer>
      <CSMainAvailableCarsCheckboxList type='types[]' options={typeOptions} title='TYPE' />
      <CSMainAvailableCarsCheckboxList type='capacities[]' options={capacityOptions} title='CAPACITY' />

      <SectionTitle>PRICE / HOUR</SectionTitle>
      <CSCommonRangeSlider
        min={0}
        max={100}
        value={priceRange}
        onChange={setPriceRange}
        formatValue={(value) => `$${value.toFixed(2)}`}
      />
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