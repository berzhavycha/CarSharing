import { AdvancedImage, lazyload, placeholder } from '@cloudinary/react';
import { Quality } from '@cloudinary/url-gen/qualifiers';
import { FC, memo } from 'react';
import { FaCog, FaGasPump, FaUsers } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import { cld } from '@/app/cloudinary';
import { CSCommonPrice, CSCommonPrimaryButton } from '@/components/cs-common';
import { CarFuelType, extractBracketContent, getFuelUnit } from '@/helpers';
import { Car } from '@/types';

import { CarFeature } from './cs-common-car-feature';

type CarCardProps = {
  carDetails: Car;
  onClick: () => void;
};

export const CSCommonCarCard: FC<CarCardProps> = memo(({ carDetails, onClick }) => {
  const carImage = cld.image(carDetails.pictures[0]?.publicId).quality(Quality.auto());

  return (
    <CardWrapper onClick={onClick}>
      <Header>
        <Title>{carDetails.model}</Title>
        <Type>{carDetails.type}</Type>
      </Header>
      <CarImageWrapper>
        <ShadowImage src="../../../../public/shadow.png" alt="" />
        <StyledAdvancedImage
          cldImg={carImage}
          plugins={[lazyload(), placeholder()]}
          alt={carDetails.model}
        />
      </CarImageWrapper>
      <Features>
        <CarFeature
          icon={<FaGasPump />}
          text={`${carDetails.fuelCapacity} ${getFuelUnit(carDetails.fuelType as CarFuelType)}`}
        />
        <CarFeature icon={<FaCog />} text={extractBracketContent(carDetails.steering)} />
        <CarFeature icon={<FaUsers />} text={`${carDetails.capacity} People`} />
      </Features>
      <Footer>
        <CSCommonPrice amount={carDetails.pricePerHour} metric="hour" />
        <CSCommonPrimaryButton
          as={Link}
          to="/rental-form"
          content="Rent Now"
          state={{ car: carDetails }}
        />
      </Footer>
    </CardWrapper>
  );
});

const CardWrapper = styled.div`
  width: 100%;
  max-width: 550px;
  height: 410px;
  background-color: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: var(--default-transition);

  &:hover {
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }
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
  height: 180px;
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

const StyledAdvancedImage = styled(AdvancedImage)`
  width: 100%;
  height: 120px;
  object-fit: contain;
  z-index: 1;
`;

const Features = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
