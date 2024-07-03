import { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { CSCommonNoData } from '@/components/cs-common';
import { Car } from '@/types';

import { CSCommonCarCard } from '../cs-common-car-card';

type Props = {
  cars: Car[];
};

export const CSCommonCarList: FC<Props> = ({ cars }) => {
  const navigate = useNavigate();

  return (
    <>
      {cars?.length === 0 ? (
        <NoDataWrapper>
          <CSCommonNoData message="No cars available" />
        </NoDataWrapper>
      ) : (
        cars?.map((car) => (
          <CSCommonCarCard
            key={car.id}
            onClick={() => navigate(`/available-cars/${car.id}`)}
            carDetails={car}
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
