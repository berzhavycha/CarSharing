import { FC } from 'react';
import styled from 'styled-components';

import { TableCell, TableRow } from '@/components/cs-common';
import { Env } from '@/core';
import { uppercaseFirstLetter } from '@/helpers';
import { Car } from '@/types';
import { Link } from 'react-router-dom';

type Props = {
  car: Car;
  index: number;
  onRemoveClick: (car: Car) => void;
};

export const CSDashboardCarTableRow: FC<Props> = ({
  car,
  index,
  onRemoveClick,
}) => {
  return (
    <TableRow key={car.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <img src={`${Env.API_BASE_URL}/local-files/${car.pictures[0]?.id}`} alt="Car Image" />
      </TableCell>
      <TableCell>{car.model}</TableCell>
      <TableCell>{car.year}</TableCell>
      <TableCell>${car.pricePerHour}</TableCell>
      <TableCell>{car.type}</TableCell>
      <TableCell>
        <StatusBadge $status={car.status}>{uppercaseFirstLetter(car.status)}</StatusBadge>
      </TableCell>
      <TableCell>
        <Buttons>
          <DetailsButton to={`/dashboard/edit-car?carId=${car.id}`}>Details</DetailsButton>
          <RemoveButton onClick={() => onRemoveClick(car)}>Remove</RemoveButton>
        </Buttons>
      </TableCell>
    </TableRow>
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
        return 'var(--green-status-text)';
      case 'booked':
        return 'var(--yellow-status-text)';
      case 'maintained':
        return 'var(--red-status-text)';
      default:
        return 'var(--default-text)';
    }
  }};
  background-color: ${(props): string => {
    switch (props.$status) {
      case 'available':
        return 'var(--green-status-bg)';
      case 'booked':
        return 'var(--yellow-status-bg)';
      case 'maintained':
        return 'var(--red-status-bg)';
      default:
        return 'var(--default-bg)';
    }
  }};
  border: 2px solid
    ${(props): string => {
    switch (props.$status) {
      case 'available':
        return 'var(--green-status-border)';
      case 'booked':
        return 'var(--yellow-status-border)';
      case 'maintained':
        return 'var(--red-status-border)';
      default:
        return 'var(--default-border)';
    }
  }};
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
`

const DetailsButton = styled(Link)`
  font-size: 14px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--main-blue);
  color: white;
  cursor: pointer;
  margin-right: 5px;
  transition: var(--default-transition);
  text-decoration: none;

  &:hover {
    background-color: var(--dark-blue);
  }
`;

const RemoveButton = styled.button`
  padding: 7px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--red-status-text);
  color: white;
  cursor: pointer;
  margin-right: 5px;
  transition: var(--default-transition);

  &:hover {
    background-color: #aa2633;
  }
`;
