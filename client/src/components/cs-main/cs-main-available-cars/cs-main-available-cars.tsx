import { FC, Suspense, useState } from 'react';
import { FaFilter } from 'react-icons/fa';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonCloseButton, CSCommonError, CSCommonSpinner } from '@/components/cs-common';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { useClickOutside } from '@/hooks';
import { AvailableCarsLoaderData } from '@/pages';
import { device } from '@/styles';

import { CSMainAvailableCarsFilter } from './cs-main-available-cars-filter';
import { CSMainAvailableCarsList } from './cs-main-available-cars-list';

export const CSMainAvailableCars: FC = () => {
  const data = useLoaderData() as AvailableCarsLoaderData;

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const ref = useClickOutside(() => setIsSidebarOpen(false));
  const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen);
  const onSidebarClose = (): void => setIsSidebarOpen(false);

  return (
    <AvailableCarsWrapper>
      <FilterButtonWrapper>
        <FilterButton onClick={toggleSidebar}>
          <FaFilter />
        </FilterButton>
      </FilterButtonWrapper>

      <SidebarContainer $isOpen={isSidebarOpen} ref={ref}>
        <CSCommonCloseButton onClose={onSidebarClose} color="var(--main-blue)" />
        <Suspense fallback={<CSCommonSpinner />}>
          <Await
            resolve={data.filterOptions}
            errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
          >
            {(resolvedData) => <CSMainAvailableCarsFilter data={resolvedData} />}
          </Await>
        </Suspense>
      </SidebarContainer>

      <CarsWrapper>
        <Suspense fallback={<CSCommonSpinner />}>
          <Await
            resolve={data.carsData}
            errorElement={
              <CarsErrorWrapper>
                <CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />
              </CarsErrorWrapper>
            }
          >
            {(resolvedData) => <CSMainAvailableCarsList data={resolvedData} />}
          </Await>
        </Suspense>
      </CarsWrapper>
    </AvailableCarsWrapper>
  );
};

const AvailableCarsWrapper = styled.div`
  display: flex;
  gap: 20px;
  min-height: 74vh;
  position: relative;

  @media ${device.sm} {
    flex-direction: column;
  }
`;
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

const CarsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.25rem;
  width: 100%;
  margin: 40px;

  @media ${device.lg} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${device.md} {
    grid-template-columns: repeat(1, 1fr);
  }

  @media ${device.sm} {
    margin: 20px;
    width: auto;
  }
`;

const CarsErrorWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
