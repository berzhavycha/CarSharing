import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonNoData } from '@/components/cs-common';
import { Env } from '@/core';
import { useRentCar } from '@/hooks';
import { Car } from '@/types';
import { CSCommonCarCard } from '../cs-common-car-card';

type Props = {
  cars: Car[];
};

export const CSCommonCarList: FC<Props> = ({ cars }) => {
  const navigate = useNavigate();
  const { onRentBtnClick } = useRentCar();

  return (
    <>
      {cars?.length === 0 ? (
        <NoDataWrapper>
          <CSCommonNoData message="No cars available" />
        </NoDataWrapper>
      ) : (
        cars?.map((car) => (
          <CSCommonCarCard
            onClick={() => navigate(`/available-cars/${car.id}`)}
            onRent={() => onRentBtnClick(car)}
            key={car.id}
            model={car.model}
            pricePerHour={car.pricePerHour}
            type={car.type}
            steering={car.steering}
            capacity={car.capacity}
            fuelCapacity={car.fuelCapacity}
            imageUrl={`${Env.API_BASE_URL}/local-files/${car.pictures[0]?.id}`}
          />
        ))
      )}
    </>
  );
};

const NoDataWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
