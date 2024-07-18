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
import { Car, PublicFile } from '@/types';

import { CSMainSingleCarDetails } from './cs-main-single-car-details';

export const CSMainSingleCar: FC = () => {
  const data = useLoaderData() as { data: Car };

  return (
    <CSCommonContainer>
      <SingleCarWrapper>
        <Suspense fallback={<CSCommonSpinner />}>
          <Await
            resolve={data.data}
            errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
          >
            {(car) => {
              const carImagesPublicIds = car.pictures.map((pic: PublicFile) => pic?.publicId);
              return (
                <>
                  <CSCommonSlides publicIds={carImagesPublicIds} width="100%" height="20vw" />
                  <CSMainSingleCarDetails car={car} />
                </>
              );
            }}
          </Await>
        </Suspense>
      </SingleCarWrapper>
    </CSCommonContainer>
  );
};

const SingleCarWrapper = styled.div`
  margin-top: 50px;
  display: flex;
  gap: 30px;

  @media ${device.lg} {
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 50px 0;
  }
`;
