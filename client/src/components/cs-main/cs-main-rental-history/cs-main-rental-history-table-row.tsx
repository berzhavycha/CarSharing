import { FC } from 'react';
import styled from 'styled-components';

import { TableCell, TableRow } from '@/components/cs-common';
import { Env } from '@/core';
import { formatDate, uppercaseFirstLetter, RentalStatus } from '@/helpers';
import { Link } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { RentalType } from '@/app/models';

type Props = {
  rental: RentalType;
  index: number;
  onCarReturn: () => Promise<void>
};

export const CSMainRentalHistoryTableRow: FC<Props> = observer(({
  rental,
  index,
  onCarReturn
}) => {
  return (
    <TableRow key={rental.id}>
      <TableCell>{index + 1}</TableCell>
      <TableCell>
        <img src={`${Env.API_BASE_URL}/local-files/${rental.originalCar?.pictures?.[0]?.id}`} alt="Car Image" />
      </TableCell>
      <TableCell>{rental.originalCar?.model}</TableCell>
      <TableCell>{rental.requestedHours}</TableCell>
      <TableCell>{rental.totalPrice}</TableCell>
      <TableCell>{formatDate(rental.rentalStart)}</TableCell>
      <TableCell>{rental.rentalEnd ? formatDate(rental.rentalEnd) : '-'}</TableCell>
      <TableCell>
        <StatusBadge $status={rental.status as RentalStatus}>{uppercaseFirstLetter(rental.status)}</StatusBadge>
      </TableCell>
      <TableCell>
        <Buttons>
          {rental.status === RentalStatus.ACTIVE && (
            <ReturnButton onClick={onCarReturn}>Return Car</ReturnButton>
          )}
          <DetailsButton to={`/rental-history/${rental.id}`} >Details</DetailsButton>
        </Buttons>
      </TableCell>
    </TableRow>
  );
});

const StatusBadge = styled.div<{ $status: RentalStatus }>`
  width: 100%;
  display: inline-block;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;

   color: ${(props): string => {
    switch (props.$status) {
      case RentalStatus.ACTIVE:
        return 'var(--green-status-text)';
      case RentalStatus.CLOSED:
        return 'var(--yellow-status-text)';
      case RentalStatus.CANCELLED:
        return 'var(--red-status-text)';
      default:
        return 'var(--default-text)';
    }
  }};
  background-color: ${(props): string => {
    switch (props.$status) {
      case RentalStatus.ACTIVE:
        return 'var(--green-status-bg)';
      case RentalStatus.CLOSED:
        return 'var(--yellow-status-bg)';
      case RentalStatus.CANCELLED:
        return 'var(--red-status-bg)';
      default:
        return 'var(--default-bg)';
    }
  }};
  border: 2px solid
    ${(props): string => {
    switch (props.$status) {
      case RentalStatus.ACTIVE:
        return 'var(--green-status-border)';
      case RentalStatus.CLOSED:
        return 'var(--yellow-status-border)';
      case RentalStatus.CANCELLED:
        return 'var(--red-status-border)';
      default:
        return 'var(--default-border)';
    }
  }};
`;

const Buttons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const ReturnButton = styled.button`
  padding: 7px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--main-blue);
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: var(--dark-blue);
  }
`;

const DetailsButton = styled(Link)`
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--main-blue);
  color: white;
  cursor: pointer;
  font-size: 12px;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: var(--dark-blue);
  }
`;
