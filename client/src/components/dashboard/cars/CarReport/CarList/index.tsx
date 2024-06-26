import React, { FC } from 'react';
import styled from 'styled-components';

const CarListContainer = styled.div`
  width: 250px;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
`;

const CarItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CarList: FC = () => {
    const cars = [
        { name: 'Alex Noman', carNo: '5689', status: 'Available' },
        { name: 'Ethan Miller', carNo: '5689', status: 'Unavailable' },
        // Add more cars...
    ];

    return (
        <CarListContainer>
            {cars.map((car, index) => (
                <CarItem key={index}>
                    <div>
                        <div>{car.name}</div>
                        <div>Car no. {car.carNo}</div>
                    </div>
                    <div>{car.status}</div>
                </CarItem>
            ))}
        </CarListContainer>
    );
};