import { FC } from 'react';

import { CSCarCard } from '@/components/cs-car';
import { CSCommonNoData } from '@/components/cs-common';
import { Env } from '@/core';
import { Car } from '@/types';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

type Props = {
    cars: Car[];
};

export const CSCommonCarList: FC<Props> = ({ cars }) => {
    const navigate = useNavigate()

    return (
        <>
            {cars?.length === 0 ? (
                <NoDataWrapper>
                    <CSCommonNoData message="No cars available" />
                </NoDataWrapper>
            ) : (
                cars?.map((car) => (
                    <CSCarCard
                        onClick={() => navigate(`/available-cars/${car.id}`)}
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
`