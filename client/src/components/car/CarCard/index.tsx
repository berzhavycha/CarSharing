import styled from "styled-components";
import { FaGasPump, FaCog, FaUsers } from "react-icons/fa";
import { FC } from "react";
import { CarFeature } from "../CarFeature";

type CarCardProps = {
  model: string;
  type: string;
  fuelCapacity: number;
  transmission: string;
  capacity: number;
  pricePerHour: number;
  imageUrl: string;
}

export const CarCard: FC<CarCardProps> = ({
  model,
  type,
  fuelCapacity,
  transmission,
  capacity,
  pricePerHour,
  imageUrl
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
        <CarFeature icon={<FaCog />} text={transmission} />
        <CarFeature icon={<FaUsers />} text={`${capacity} People`} />
      </Features>
      <Footer>
        <Price>${pricePerHour}.00<Metric> / hour</Metric></Price>
        <RentButton>Rent Now</RentButton>
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
  color: #1A202C;
  margin-bottom: 5px;
`;

const Type = styled.p`
  font-size: 14px;
  color: #90A3BF;
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
  bottom: 20px;
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

const Price = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: #1A202C;
`;

const Metric = styled.span`
  font-size: 14px;
  font-weight: normal;
  color: #90A3BF;
`;

const RentButton = styled.button`
  background-color: #3563E9;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: var(--default-transition);
  
  &:hover {
    background-color: #2b4fad;
  }
`;
