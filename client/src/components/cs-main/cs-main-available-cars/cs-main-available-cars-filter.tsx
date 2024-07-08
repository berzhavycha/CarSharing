import { FC, useState } from 'react';

import { CSCommonCheckboxFilter, CSCommonCloseButton, CSCommonRangeFilter } from '@/components/cs-common';
import { MIN_PRICE, PRICE_ROUNDING_INTERVAL } from '@/helpers';
import { AvailableCarsLoaderData } from '@/pages';

import { CSMainAvailableCarsSort } from './cs-main-available-cars-sort';
import { useClickOutside } from '@/hooks';
import { FaFilter } from 'react-icons/fa';
import { device } from '@/styles';
import styled from 'styled-components';

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

  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  const ref = useClickOutside(() => setIsSidebarOpen(false));
  const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen);
  const onSidebarClose = (): void => setIsSidebarOpen(false);

  return (
    <>
      <FilterButtonWrapper>
        <FilterButton onClick={toggleSidebar}>
          <FaFilter />
        </FilterButton>
      </FilterButtonWrapper>

      <SidebarContainer $isOpen={isSidebarOpen} ref={ref}>
        {isSidebarOpen && <CSCommonCloseButton onClose={onSidebarClose} color="var(--main-blue)" />}
        
        <CSCommonCheckboxFilter type="types[]" options={typeOptions} title="TYPE" />
        <CSCommonCheckboxFilter type="capacities[]" options={capacityOptions} title="CAPACITY" />
        <CSCommonRangeFilter
          title={'PRICE / HOUR'}
          min={MIN_PRICE}
          max={data.maxPrice}
          roundingInterval={PRICE_ROUNDING_INTERVAL}
          minParam="minPrice"
          maxParam="maxPrice"
        />
        <CSMainAvailableCarsSort />
      </SidebarContainer>
    </>
  );
};

const FilterButtonWrapper = styled.div`
  position: sticky;
  top: 0;
  z-index: 1000;
  background-color: var(--main-blue);
  padding: 10px 0;
  display: none;

  @media ${device.sm} {
    display: block;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  svg {
    margin-right: 8px;
  }
`;

const SidebarContainer = styled.div<{ $isOpen: boolean }>`
  flex: 0 0 24%;
  padding: 35px;
  background-color: white;
  min-height: 100%;
  margin-top: 5px;
  position: relative;

  @media ${device.sm} {
    position: fixed;
    top: 0;
    left: 0;
    width: 80%;
    height: 100%;
    z-index: 1001;
    transform: translateX(${(props): string => (props.$isOpen ? '0' : '-100%')});
    transition: transform 0.3s ease-in-out;
    overflow-y: auto;
  }
`;