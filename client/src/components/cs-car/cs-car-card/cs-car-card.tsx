import { FC } from 'react';
import { FaCog, FaGasPump, FaUsers } from 'react-icons/fa';
import styled from 'styled-components';

import { CSCommonPrice, CSCommonPrimaryButton } from '@/components/cs-common';

import { CarFeature } from '../cs-car-feature';

type CarCardProps = {
  model: string;
  type: string;
  fuelCapacity: number;
  steering: string;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
};

export const CSCarCard: FC<CarCardProps> = ({
  model,
  type,
  fuelCapacity,
  steering,
  capacity,
  pricePerHour,
  imageUrl,
}) => {
  return (
    <CardWrapper>
      <Header>
        <Title>{model}</Title>
        <Type>{type}</Type>
      </Header>
      <CarImageWrapper>
        <ShadowImage src="../../../../public/shadow.png" alt="" />
        <CarImage src={imageUrl} alt={model} />
      </CarImageWrapper>
      <Features>
        <CarFeature icon={<FaGasPump />} text={`${fuelCapacity}L`} />
        <CarFeature icon={<FaCog />} text={steering} />
        <CarFeature icon={<FaUsers />} text={`${capacity} People`} />
      </Features>
      <Footer>
        <CSCommonPrice amount={pricePerHour} metric="hours" />
        <CSCommonPrimaryButton content="Rent Now" onClick={() => console.log('rent')} />
      </Footer>
    </CardWrapper>
  );
};

const CardWrapper = styled.div`
  width: 300px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  margin-bottom: 15px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: var(--dark);
  margin-bottom: 5px;
`;

const Type = styled.p`
  font-size: 14px;
  color: var(--gray);
  font-weight: 600;
  margin: 0;
`;

const CarImageWrapper = styled.div`
  position: relative;
  padding: 30px 0;
  margin-bottom: 15px;
`;

const ShadowImage = styled.img`
  position: absolute;
  bottom: 15px;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: auto;
  z-index: 2;
`;

const CarImage = styled.img`
  position: relative;
  width: 100%;
  height: auto;
  z-index: 1;
`;

const Features = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 25px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
