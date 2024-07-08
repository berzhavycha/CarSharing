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
import { Car, LocalFile } from '@/types';

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
              const carImages = car.pictures.map(
                (pic: LocalFile) => `${Env.API_BASE_URL}/local-files/${pic?.id}`,
              );
              return (
                <>
                  <CSCommonSlides images={carImages} width="45vw" height="18vw" />
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
