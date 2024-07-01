import { FC, Suspense } from 'react';

import { CSCarCard, CSCommonContainer, CSCommonError, CSCommonNoData, CSCommonSpinner, CSMainPageBanner } from '@/components';

import BannerImage from '../../../public/banner 2.png'
import DefaultCar from '../../../public/default-car.png'
import styled from 'styled-components';
import { Await, useLoaderData } from 'react-router-dom';
import { InitialCarsLoaderData } from './loader';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { Env } from '@/core';
import { Car } from '@/types';

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
                <>
                  {data.cars.length === 0 ? (
                    <tr>
                      <td colSpan={8}>
                        <CSCommonNoData message="No cars available" />
                      </td>
                    </tr>
                  ) : (
                    data.cars.map((car: Car) => (
                      <CSCarCard
                        model={car.model}
                        pricePerHour={car.pricePerHour}
                        steering={car.steering}
                        type={car.type}
                        fuelCapacity={car.fuelCapacity}
                        capacity={car.capacity}
                        imageUrl={`${Env.API_BASE_URL}/local-files/${car.pictures[0]?.id}`}
                      />
                    ))
                  )}
                </>
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