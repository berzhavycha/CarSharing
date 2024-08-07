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
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { device } from '@/styles';
import { PublicFile, Rental } from '@/types';

import { CSMainRentalHistoryModals } from '../cs-main-rental-history/cs-main-rental-history-modals';

import { CSMainSingleRentalDetails } from './cs-main-single-rental-details';

export const CSMainSingleRental: FC = observer(() => {
  const data = useLoaderData() as { data: Rental };

  return (
    <CSCommonContainer>
      <Suspense
        fallback={
          <SpinnerContainer>
            <CSCommonSpinner />
          </SpinnerContainer>
        }
      >
        <Await
          resolve={data.data}
          errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
        >
          {(rental) => {
            const carImagesPublicIds = rental.originalCar?.pictures?.map(
              (pic: PublicFile) => pic?.url,
            );

            return (
              <RentalDetailsContainer>
                <CSCommonSlides images={carImagesPublicIds} width="100%" height="20vw" />
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

const SpinnerContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80vh;
`;

const RentalDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 60px;
  margin: 50px 0;

  @media ${device.lg} {
    flex-direction: column;
  }

  @media ${device.md} {
    gap: 40px;
  }

  @media ${device.md} {
    gap: 20px;
  }
`;
