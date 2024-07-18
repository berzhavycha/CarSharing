import { FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonError, Spinner } from '@/components/cs-common';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { AvailableCarsLoaderData } from '@/pages';
import { device } from '@/styles';

import { CSMainAvailableCarsFilter } from './cs-main-available-cars-filter';
import { CSMainAvailableCarsList } from './cs-main-available-cars-list';

export const CSMainAvailableCars: FC = () => {
  const data = useLoaderData() as AvailableCarsLoaderData;

  return (
    <AvailableCarsWrapper>
      <Suspense fallback={
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      }>
        <Await
          resolve={Promise.all([data.filterOptions, data.carsData])}
          errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
        >
          {([filterOptions, carsData]) => (
            <>
              <CSMainAvailableCarsFilter data={filterOptions} />
              <CSMainAvailableCarsList data={carsData} />
            </>
          )}
        </Await>
      </Suspense>
    </AvailableCarsWrapper>
  );
};

const SpinnerWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const AvailableCarsWrapper = styled.div`
  display: flex;
  gap: 20px;
  min-height: 74vh;
  position: relative;

  @media ${device.sm} {
    flex-direction: column;
  }
`;
