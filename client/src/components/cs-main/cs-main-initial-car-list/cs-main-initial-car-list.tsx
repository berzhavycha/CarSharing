import { FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonCarList, CSCommonError, CSCommonSpinner } from '@/components/cs-common';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { InitialCarsLoaderData } from '@/pages';

export const CSMainInitialCarList: FC = () => {
  const data = useLoaderData() as { data: InitialCarsLoaderData };

  return (
    <CarsWrapper>
      <Suspense fallback={<CSCommonSpinner />}>
        <Await
          resolve={data.data}
          errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
        >
          {(data) => {
            return <CSCommonCarList cars={data.cars} />;
          }}
        </Await>
      </Suspense>
    </CarsWrapper>
  );
};

const CarsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;
