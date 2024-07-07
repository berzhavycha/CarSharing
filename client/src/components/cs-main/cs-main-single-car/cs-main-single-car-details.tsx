import { FC } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import {
  BaseSection,
  CSCommonDetailsFeature,
  CSCommonPrice,
  CSCommonPrimaryButton,
  SectionDescription,
  SectionTitle,
} from '@/components/cs-common';
import { CarFuelType, getFuelUnit } from '@/helpers';
import { device } from '@/styles';
import { Car } from '@/types';

type Props = {
  car: Car;
};

export const CSMainSingleCarDetails: FC<Props> = ({ car }) => {
  return (
    <CarDetailsWrapper>
      <Title>{car.model}</Title>
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

const CarDetailsWrapper = styled(BaseSection)`
  width: 50%;
  padding: 30px;

  @media ${device.lg} {
    width: 100%;
  }
`;

const Title = styled(SectionTitle)`
  font-size: 20px;

  @media ${device.xs} {
    font-size: 16px;
  }
`;

const Description = styled(SectionDescription)`
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
