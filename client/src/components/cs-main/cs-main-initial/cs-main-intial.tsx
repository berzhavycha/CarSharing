import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonBanner, CSCommonContainer, CSCommonPrimaryButton } from '@/components';
import { device } from '@/styles';

import BannerImage1 from '../../../../public/banner 1.png';
import BannerImage2 from '../../../../public/banner 2.png';
import DefaultCar from '../../../../public/default-car.png';

import { CSMainInitialCarList } from './cs-main-initial-car-list';

export const CSMainInitial: FC = () => {
  return (
    <CSCommonContainer>
      <BannerWrappers>
        <CSCommonBanner
          title="The Best Platform for Car Sharing"
          backgroundImage={BannerImage1}
          description="Ease of doing a car rental safely and reliably. Of course at a low price."
          image={DefaultCar}
          buttonType="main"
          linkContent="Rent Car"
          onLinkRedirect="/available-cars"
        />
        <CSCommonBanner
          title="Easy way to rent a car at a low price"
          backgroundImage={BannerImage2}
          description="Providing cheap car rental services and safe and comfortable facilities."
          image={DefaultCar}
          buttonType="light"
          linkContent="Rent Car"
          onLinkRedirect="/available-cars"
        />
      </BannerWrappers>
      <CSMainInitialCarList />
      <ShowMoreWrapper>
        <CSCommonPrimaryButton as={Link} to="/available-cars" content="Show more cars" />
      </ShowMoreWrapper>
    </CSCommonContainer>
  );
};

const BannerWrappers = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 50px;
  margin-bottom: 30px;

  @media ${device.sm} {
    flex-direction: column;
  }
`;

const ShowMoreWrapper = styled.div`
  margin: 40px 0;
  text-align: center;
`;
