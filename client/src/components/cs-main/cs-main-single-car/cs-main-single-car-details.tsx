import { FC } from 'react';
import styled from 'styled-components';

import { CSCommonDetailsFeature, CSCommonPrice, CSCommonPrimaryButton, CSCommonTitle } from '@/components/cs-common';
import { CarFuelType, getFuelUnit } from '@/helpers';
import { Car } from '@/types';

import { Link } from 'react-router-dom';
import { device } from '@/styles';

type Props = {
  car: Car;
};

export const CSMainSingleCarDetails: FC<Props> = ({ car }) => {
  return (
    <CarDetailsWrapper>
      <CSCommonTitle>{car.model}</CSCommonTitle>
      <Description>{car.description}</Description>
      <FeaturesWrapper>
        <CSCommonDetailsFeature label="Type" text={car.type} />
        <CSCommonDetailsFeature label="Year" text={car.year} />
        <CSCommonDetailsFeature label="Capacity" text={`${car.capacity} People`} />
        <CSCommonDetailsFeature label="Steering" text={car.steering} />
        <CSCommonDetailsFeature label="Fuel Type" text={car.fuelType} />
        <CSCommonDetailsFeature
          label="Fuel Capacity"
          text={`${car.fuelCapacity} ${getFuelUnit(car.fuelType as CarFuelType)}`}
        />
      </FeaturesWrapper>
      <CarFooter>
        <CSCommonPrice amount={car.pricePerHour} metric="hour" />
        <CSCommonPrimaryButton as={Link} to="/rental-form" state={{ car }} content="Rent Car" />
      </CarFooter>
    </CarDetailsWrapper>
  );
};

const CarDetailsWrapper = styled.div`
  width: 50%;
  background-color: white;
  padding: 30px;
  border-radius: 20px;
  box-shadow: var(--default-box-shadow);

  @media ${device.lg} {
    width: 100%;
  }
`;

const Description = styled.h2`
  font-size: 15px;
  font-weight: 300;
  color: var(--dark);
  margin-bottom: 30px;

  @media ${device.sm} {
    font-size: 14px;
  }

  @media ${device.xs} {
    font-size: 12px;
  }
`;

const FeaturesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 30px;
  gap: 20px 0;
  
  @media ${device.sm} {
    flex-direction: column;
    gap: 15px 0;
  }
`;

const CarFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
