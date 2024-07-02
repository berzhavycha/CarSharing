import { FC, useState } from 'react';
import styled from 'styled-components';

import { AvailableCarsLoaderData } from '../../../pages/user/cs-main-available-cars-page/loader';
import { CSMainAvailableCarsCheckboxList, SectionTitle } from './cs-main-available-cars-checkbox-list';

type Props = {
  data: AvailableCarsLoaderData['filterOptions'];
};


export const CSMainAvailableCarsFilter: FC<Props> = ({ data }) => {
  const [maxPrice, setMaxPrice] = useState<number>(100);

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

      <SectionTitle>PRICE</SectionTitle>
      <PriceSliderContainer>
        <PriceSlider
          type="range"
          min="0"
          max="100"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
        />
        <PriceValue>Max. ${maxPrice.toFixed(2)}</PriceValue>
      </PriceSliderContainer>
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

const PriceSliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PriceSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 10px;
  border-radius: 5px;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  -webkit-transition: 0.2s;
  transition: opacity 0.2s;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--main-blue);
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--gray);
    cursor: pointer;
  }
`;

const PriceValue = styled.div`
  margin-top: 10px;
  font-size: 14px;
  color: #333;
`;
