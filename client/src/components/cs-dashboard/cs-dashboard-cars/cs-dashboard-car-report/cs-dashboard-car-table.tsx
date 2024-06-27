import { FC } from 'react';
import styled from 'styled-components';

import { uppercaseFirstLetter } from '@/helpers';
import { Car } from '@/types';

import { Table, TableCell, TableHeader, TableRow } from '@/components/cs-common';
import { Env } from '@/core';

type CarTableProps = {
  cars: Car[];
  onDetailsBtnClick: (car: Car) => void;
  onSortChange: (sort: string) => void;
}

export const CarTable: FC<CarTableProps> = ({ cars, onDetailsBtnClick, onSortChange }) => {
  return (
    <Table>
      <thead>
        <tr>
          <TableHeader>No.</TableHeader>
          <TableHeader>Image</TableHeader>
          <TableHeader onClick={() => onSortChange('model')}>Model</TableHeader>
          <TableHeader onClick={() => onSortChange('year')}>Year</TableHeader>
          <TableHeader onClick={() => onSortChange('pricePerHour')}>Price / Hour</TableHeader>
          <TableHeader onClick={() => onSortChange('type')}>Type</TableHeader>
          <TableHeader onClick={() => onSortChange('status')}>Status</TableHeader>
          <TableHeader>Actions</TableHeader>
        </tr>
      </thead>
      <tbody>
        {cars.map((car, index) => (
          <TableRow key={car.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <img src={`${Env.API_BASE_URL}/local-files/${car.pictures[0]?.id}`} alt="Car Image" />
            </TableCell>
            <TableCell>{car.model}</TableCell>
            <TableCell>{car.year}</TableCell>
            <TableCell>$ {car.pricePerHour}</TableCell>
            <TableCell>{car.type}</TableCell>
            <TableCell>
              <StatusBadge $status={car.status}>{uppercaseFirstLetter(car.status)}</StatusBadge>
            </TableCell>
            <TableCell>
              <Button onClick={() => onDetailsBtnClick(car)}>Details</Button>
              <Button>Remove</Button>
            </TableCell>
          </TableRow>
        ))}
      </tbody>
    </Table>
  );
};



const StatusBadge = styled.div<{ $status: string }>`
  width: 100%;
  display: inline-block;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: ${(props): string => {
    switch (props.$status) {
      case 'available':
        return 'var(--available-text)';
      case 'booked':
        return 'var(--booked-text)';
      case 'maintained':
        return 'var(--maintained-text)';
      default:
        return 'var(--default-text)';
    }
  }};
  
  background-color: ${(props): string => {
    switch (props.$status) {
      case 'available':
        return 'var(--available-bg)';
      case 'booked':
        return 'var(--booked-bg)';
      case 'maintained':
        return 'var(--maintained-bg)';
      default:
        return 'var(--default-bg)';
    }
  }};
  
  border: 2px solid ${(props): string => {
    switch (props.$status) {
      case 'available':
        return 'var(--available-border)';
      case 'booked':
        return 'var(--booked-border)';
      case 'maintained':
        return 'var(--maintained-border)';
      default:
        return 'var(--default-border)';
    }
  }};
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--main-blue);
  color: white;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: var(--dark-blue);
  }
`;
