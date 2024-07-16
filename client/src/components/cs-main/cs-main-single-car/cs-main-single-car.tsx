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
import { Car, LocalFile } from '@/types';

import { CSMainSingleCarDetails } from './cs-main-single-car-details';
import { Env } from '@/core';

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
                  <SlideWrapper>
                    <CSCommonSlides images={carImages} />
                  </SlideWrapper>
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
  display: flex;
  align-items: center;
  gap: 60px;
  margin: 50px 0;

  @media ${device.lg} {
    flex-direction: column;
  }
`;

const SlideWrapper = styled.div`
  width: 100%;
  max-width: 600px;
`;