import { FC, Suspense } from 'react';

import { CSCommonContainer, CSCommonError, CSCommonSpinner, CSInitialCarList, CSMainPageBanner } from '@/components';

import BannerImage from '../../../public/banner 2.png'
import DefaultCar from '../../../public/default-car.png'
import styled from 'styled-components';
import { Await, useLoaderData } from 'react-router-dom';
import { InitialCarsLoaderData } from './loader';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';

export const CSMainUserPage: FC = () => {
  const data = useLoaderData() as { data: InitialCarsLoaderData }

  return (
    <CSCommonContainer>
      <BannerWrappers>
        <CSMainPageBanner title='The Best Platform for Car Sharing' backgroundImage={BannerImage} description='Ease of doing a car rental safely and reliably. Of course at a low price.' carImage={DefaultCar} buttonType='light' />
        <CSMainPageBanner title='The Best Platform for Car Sharing' backgroundImage={BannerImage} description='Ease of doing a car rental safely and reliably. Of course at a low price.' carImage={DefaultCar} buttonType='main' />
      </BannerWrappers>
      <CarsWrapper>
        <Suspense fallback={<CSCommonSpinner />}>
          <Await
            resolve={data.data}
            errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
          >
            {(data) => {
              return (
                <CSInitialCarList cars={data.cars} />
              );
            }}
          </Await>
        </Suspense>
      </CarsWrapper>
    </CSCommonContainer>
  );
};


const BannerWrappers = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const CarsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`