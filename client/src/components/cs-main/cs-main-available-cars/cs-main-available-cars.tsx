import { FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonError, CSCommonSpinner } from '@/components/cs-common';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { AvailableCarsLoaderData } from '@/pages';

import { CSMainAvailableCarsFilter } from './cs-main-available-cars-filter';
import { CSMainAvailableCarsList } from './cs-main-available-cars-list';

export const CSMainAvailableCars: FC = () => {
  const data = useLoaderData() as AvailableCarsLoaderData;

  return (
    <AvailableCarsWrapper>
      <SidebarContainer>
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
  gap: 40px;
  min-height: 74vh;
`;

const SidebarContainer = styled.div`
  flex: 0 0 24%;
  padding: 35px;
  background-color: white;
  min-height: 100%;
  margin-top: 5px;
`;

const CarsWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
  margin: 40px 8% 60px 0;
`;

const CarsErrorWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
