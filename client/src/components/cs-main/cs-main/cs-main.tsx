import { FC, Suspense } from 'react';
import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import {
  CSCommonBanner,
  CSCommonCarList,
  CSCommonContainer,
  CSCommonError,
  CSCommonPrimaryButton,
  CSCommonSpinner,
} from '@/components';
import { UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { InitialCarsLoaderData } from '@/pages';

import BannerImage1 from '../../../../public/banner 1.png';
import BannerImage2 from '../../../../public/banner 2.png';
import DefaultCar from '../../../../public/default-car.png';

export const CSMain: FC = () => {
  const navigate = useNavigate();
  const data = useLoaderData() as { data: InitialCarsLoaderData };

  const onShowMore = (): void => navigate('/available-cars');

  return (
    <CSCommonContainer>
      <BannerWrappers>
        <CSCommonBanner
          title="The Best Platform for Car Sharing"
          backgroundImage={BannerImage1}
          description="Ease of doing a car rental safely and reliably. Of course at a low price."
          image={DefaultCar}
          buttonType="main"
          buttonContent="Rent Car"
        />
        <CSCommonBanner
          title="Easy way to rent a car at a low price"
          backgroundImage={BannerImage2}
          description="Providing cheap car rental services and safe and comfortable facilities."
          image={DefaultCar}
          buttonType="light"
          buttonContent="Rent Car"
        />
      </BannerWrappers>
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
      <ShowMoreWrapper>
        <CSCommonPrimaryButton onClick={onShowMore} content="Show more cars" />
      </ShowMoreWrapper>
    </CSCommonContainer>
  );
};

const BannerWrappers = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 50px;
  margin-bottom: 30px;
`;

const CarsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
`;

const ShowMoreWrapper = styled.div`
  margin: 40px 0;
  text-align: center;
`;
