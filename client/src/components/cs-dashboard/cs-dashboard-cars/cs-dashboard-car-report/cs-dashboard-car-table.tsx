// components/CarTable.tsx
import { FC } from 'react';
import styled from 'styled-components';

import { uppercaseFirstLetter } from '@/helpers';
import { Car } from '@/types';

import DefaultImage from '../../../../../public/Car.png';

interface CarTableProps {
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
              <img src={DefaultImage} />
            </TableCell>
            <TableCell>{car.model}</TableCell>
            <TableCell>{car.year}</TableCell>
            <TableCell>$ {car.pricePerHour}</TableCell>
            <TableCell>{car.type}</TableCell>
            <TableCell>
              <StatusBadge status={car.status}>{uppercaseFirstLetter(car.status)}</StatusBadge>
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

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f8f9fa;
  border-bottom: 2px solid #dee2e6;
  cursor: pointer;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #dee2e6;

  img {
    width: 80px;
    height: 50px;
    object-fit: contain;
    border-radius: 50%;
  }
`;

const StatusBadge = styled.div<{ status: string }>`
  display: inline-block;
  width: 100%;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  color: ${(props): string => (props.status === 'available' ? '#28a745' : '#dc3545')};
  background-color: ${(props): string => (props.status === 'available' ? '#d4edda' : '#f8d7da')};
  border: 2px solid ${(props): string => (props.status === 'available' ? '#c3e6cb' : '#f5c6cb')};
`;

const Button = styled.button`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  margin-right: 5px;

  &:hover {
    background-color: #0056b3;
  }
`;
