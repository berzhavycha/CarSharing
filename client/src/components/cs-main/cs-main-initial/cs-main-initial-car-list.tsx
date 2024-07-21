import { FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonCarList, CSCommonError, Spinner } from '@/components/cs-common';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { InitialCarsLoaderData } from '@/pages';
import { device } from '@/styles';

export const CSMainInitialCarList: FC = () => {
  const data = useLoaderData() as { data: InitialCarsLoaderData };

  return (
    <CarsWrapper>
      <Suspense fallback={
        <SpinnerContainer>
          <Spinner />
        </SpinnerContainer>
      }>
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

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`

const CarsWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 305px));
  gap: 1.25rem;

  @media ${device.lg} {
    grid-template-columns: repeat(auto-fit, minmax(300px, 305px));
  }

  @media ${device.md} {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }

  @media ${device.sm} {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  }
`;
