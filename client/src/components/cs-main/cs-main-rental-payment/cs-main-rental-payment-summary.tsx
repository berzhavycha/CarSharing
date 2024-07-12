import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import { BaseSection, SectionDescription, SectionTitle } from '@/components/cs-common';
import { useStore } from '@/context';
import { device } from '@/styles';
import { Car } from '@/types';

export const CSMainRentalPaymentSummary: FC = observer(() => {
  const {
    rentalStore: { rentalPayment },
  } = useStore();

  const location = useLocation();
  const car = location.state?.car as Car;

  return (
    <SummaryWrapper>
      <SectionTitle>Rental Summary</SectionTitle>
      <SectionDescription>
        Prices may change depending on the length of the rental and the price of your rental car.
      </SectionDescription>
      <CarInfoWrapper>
        <CarImage 
        // src={car.pictures[0]?.url} 
        src=''
        />
        <CarDetails>
          <CarName>{car.model}</CarName>
          <CarType>{car.type}</CarType>
        </CarDetails>
      </CarInfoWrapper>
      <Total>
        <TotalInfo>
          <h3>Total Rental Price</h3>
          <TotalDescription>Overall price and includes rental discount</TotalDescription>
        </TotalInfo>
        <PriceWrapper>${rentalPayment.potentialRentalPrice.toFixed(2)}</PriceWrapper>
      </Total>
    </SummaryWrapper>
  );
});

const SummaryWrapper = styled(BaseSection)`
  width: 35%;
  height: 50%;
  margin-bottom: 20px;

  @media ${device.md} {
    width: 100%;
  }
`;

const CarInfoWrapper = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
  margin-bottom: 40px;
`;

const CarImage = styled.img`
  width: 40%;
  height: 120px;
  padding: 5px;
  object-fit: contain;
  border: 1px solid var(--gray);
  border-radius: 15px;
`;

const CarDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const CarName = styled.h2`
  color: var(--dark);

  @media ${device.lg} {
    font-size: 20px;
  }

  @media ${device.md} {
    font-size: 18px;
  }
`;

const CarType = styled.h4`
  color: var(--dark);
  font-weight: 300;
  margin-bottom: 10px;

  @media ${device.lg} {
    font-size: 14px;
  }

  @media ${device.md} {
    font-size: 12px;
  }
`;

const Total = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  align-items: center;
`;

const TotalInfo = styled.div`
  width: 65%;

  @media ${device.lg} {
    h3 {
      font-size: 18px;
    }
  }

  @media ${device.sm} {
    h3 {
      font-size: 16px;
    }
  }
`;

const TotalDescription = styled.div`
  font-size: 14px;
  color: var(--dark);
  margin-top: 5px;

  @media ${device.lg} {
    font-size: 12px;
  }
`;

const PriceWrapper = styled.h1`
  font-weight: bold;
  color: var(--dark);

  @media ${device.lg} {
    font-size: 24px;
  }

  @media ${device.lg} {
    font-size: 20px;
  }
`;
