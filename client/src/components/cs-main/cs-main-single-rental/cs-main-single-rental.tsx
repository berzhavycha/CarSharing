import { observer } from 'mobx-react-lite';
import { FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import {
  CSCommonContainer,
  CSCommonError,
  CSCommonSlides,
  CSCommonSpinner,
} from '@/components/cs-common';
import { Env } from '@/core';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { device } from '@/styles';
import { LocalFile, Rental } from '@/types';

import { CSMainRentalHistoryModals } from '../cs-main-rental-history/cs-main-rental-history-modals';

import { CSMainSingleRentalDetails } from './cs-main-single-rental-details';

export const CSMainSingleRental: FC = observer(() => {
  const data = useLoaderData() as { data: Rental };

  return (
    <CSCommonContainer>
      <Suspense fallback={<CSCommonSpinner />}>
        <Await
          resolve={data.data}
          errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
        >
          {(rental) => {
            const carImages = rental.originalCar?.pictures?.map(
              (pic: LocalFile) => `${Env.API_BASE_URL}/local-files/${pic?.id}`,
            );

            return (
              <RentalDetailsContainer>
                <CSCommonSlides images={carImages} width="100%" height="300px" />
                <CSMainSingleRentalDetails rental={rental} />
              </RentalDetailsContainer>
            );
          }}
        </Await>
      </Suspense>

      <CSMainRentalHistoryModals />
    </CSCommonContainer>
  );
});

const RentalDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  margin: 50px 0;

  @media ${device.lg} {
    flex-direction: column;
  }
`;
