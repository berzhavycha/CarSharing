import { FC } from 'react';

import { CSCommonContainer, CSMainPageBanner } from '@/components';

import BannerImage from '../../../public/banner 2.png'
import DefaultCar from '../../../public/default-car.png'
import styled from 'styled-components';

export const CSMainUserPage: FC = () => {
  return (
    <CSCommonContainer>
      <BannerWrappers>
        <CSMainPageBanner title='The Best Platform for Car Sharing' backgroundImage={BannerImage} description='Ease of doing a car rental safely and reliably. Of course at a low price.' carImage={DefaultCar} buttonType='light'/>
        <CSMainPageBanner title='The Best Platform for Car Sharing' backgroundImage={BannerImage} description='Ease of doing a car rental safely and reliably. Of course at a low price.' carImage={DefaultCar} buttonType='main' />
      </BannerWrappers>
    </CSCommonContainer>
  );
};


const BannerWrappers = styled.div`
  display: flex;
  gap: 20px;
`;