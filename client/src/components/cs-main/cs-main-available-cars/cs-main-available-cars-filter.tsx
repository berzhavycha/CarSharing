import { FC, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';

import { AvailableCarsLoaderData } from '../../../pages/user/cs-main-available-cars-page/loader';
import { CSMainAvailableCarsCheckboxList, SectionTitle } from './cs-main-available-cars-checkbox-list';
import { CSCommonRangeSlider } from '@/components/cs-common';
import { MIN_PRICE, PRICE_ROUNDING_INTERVAL } from '@/helpers';
import { useSearchParams } from 'react-router-dom';
import { useDebounce } from '@/hooks';

type Props = {
  data: AvailableCarsLoaderData['filterOptions'];
};

const DEBOUNCE_DELAY = 300;

export const CSMainAvailableCarsFilter: FC<Props> = ({ data }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const typeOptions = data.types;
  const capacityOptions = data.capacities.map((item) => ({
    ...item,
    label: `${item.label} People`,
    originalValue: item.label,
  }));

  const roundedMaxPrice = Math.ceil(data.maxPrice / PRICE_ROUNDING_INTERVAL) * PRICE_ROUNDING_INTERVAL;

  const initialMinPrice = parseFloat(searchParams.get('minPrice') ?? MIN_PRICE.toString());
  const initialMaxPrice = parseFloat(searchParams.get('maxPrice') ?? roundedMaxPrice.toString());

  const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice]);

  const updateSearchParams = useCallback((newPriceRange: [number, number]) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('minPrice', newPriceRange[0].toString());
    newSearchParams.set('maxPrice', newPriceRange[1].toString());
    setSearchParams(newSearchParams);
  }, [searchParams, setSearchParams]);

  const debouncedUpdateSearchParams = useDebounce(updateSearchParams, DEBOUNCE_DELAY);

  useEffect(() => {
    debouncedUpdateSearchParams(priceRange);
  }, [priceRange, debouncedUpdateSearchParams]);

  const handlePriceRangeChange = (newRange: [number, number]): void => {
    setPriceRange(newRange);
  };
  return (
    <SidebarContainer>
      <CSMainAvailableCarsCheckboxList type='types[]' options={typeOptions} title='TYPE' />
      <CSMainAvailableCarsCheckboxList type='capacities[]' options={capacityOptions} title='CAPACITY' />

      <SectionTitle>PRICE / HOUR</SectionTitle>
      <CSCommonRangeSlider
        min={MIN_PRICE}
        max={roundedMaxPrice}
        value={priceRange}
        onChange={handlePriceRangeChange}
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