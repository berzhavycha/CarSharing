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
          errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
        >
          {(resolvedData) => <CSMainAvailableCarsList data={resolvedData} />}
        </Await>
      </Suspense>
    </AvailableCarsWrapper>
  );
};

const AvailableCarsWrapper = styled.div`
  display: flex;
  gap: 40px;
  min-height: 74vh;
`;
