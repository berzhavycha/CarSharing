import { FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';

import { CSCommonError, CSCommonSpinner } from '@/components/cs-common';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { LoaderData } from '@/pages';
import { updateCar } from '@/services';

import { CSDashboardCarForm } from './cs-dashboard-car-form';
import styled from 'styled-components';

export const CSDashboardCarEditForm: FC = () => {
  const data = useLoaderData() as { data: LoaderData };

  return (
    <Suspense fallback={
      <SpinnerContainer>
        <CSCommonSpinner />
      </SpinnerContainer>
    }>
      <Await
        resolve={data.data}
        errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
      >
        {(data) => <CSDashboardCarForm carDefaultValues={data} onFormSubmit={updateCar} />}
      </Await>
    </Suspense>
  );
};

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
`;
