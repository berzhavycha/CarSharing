import { FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonError, CSCommonSpinner } from '@/components/cs-common';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { AvailableCarsLoaderData } from '@/pages';
import { device } from '@/styles';

import { CSMainAvailableCarsFilter } from './cs-main-available-cars-filter';
import { CSMainAvailableCarsList } from './cs-main-available-cars-list';

export const CSMainAvailableCars: FC = () => {
  const data = useLoaderData() as AvailableCarsLoaderData;

  return (
    <AvailableCarsWrapper>
      <Suspense fallback={<CSCommonSpinner />}>
        <Await
          resolve={data.filterOptions}
          errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
        >
          {(resolvedData) => <CSMainAvailableCarsFilter data={resolvedData} />}
        </Await>
      </Suspense>

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

const CarsErrorWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
