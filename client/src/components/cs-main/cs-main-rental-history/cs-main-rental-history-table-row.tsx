import { FC } from 'react';
import styled from 'styled-components';

import { TableCell, TableRow } from '@/components/cs-common';
import { Env } from '@/core';
import { formatDate, uppercaseFirstLetter, RentalStatus } from '@/helpers';
import { Rental } from '@/types';

type Props = {
    rental: Rental;
    index: number;
};

export const CSMainRentalHistoryTableRow: FC<Props> = ({
    rental,
    index,
}) => {
    return (
        <TableRow key={rental.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>
                <img src={`${Env.API_BASE_URL}/local-files/${rental.originalCar?.pictures?.[0]?.id}`} alt="Car Image" />
            </TableCell>
            <TableCell>{rental.originalCar.model}</TableCell>
            <TableCell>{rental.requestedHours}</TableCell>
            <TableCell>{rental.totalPrice}</TableCell>
            <TableCell>{formatDate(rental.rentalStart)}</TableCell>
            <TableCell>{rental.rentalEnd ? formatDate(rental.rentalEnd) : '-'}</TableCell>
            <TableCell>
                <StatusBadge status={rental.status as RentalStatus}>{uppercaseFirstLetter(rental.status)}</StatusBadge>
            </TableCell>
            <TableCell>
                <Buttons>
                    {rental.status === RentalStatus.ACTIVE && (
                        <ReturnButton>Return Car</ReturnButton>
                    )}
                </Buttons>
            </TableCell>
        </TableRow>
    );
};

const StatusBadge = styled.div<{ status: RentalStatus }>`
  width: 100%;
  display: inline-block;
  padding: 6px 10px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: bold;
  text-align: center;
  text-transform: capitalize;
  
  ${({ status }): string => {
        switch (status) {
            case RentalStatus.ACTIVE:
                return `
          color: #155724;
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
        `;
            case RentalStatus.CLOSED:
                return `
          color: #1b1e21;
          background-color: #d6d8d9;
          border: 1px solid #c6c8ca;
        `;
            case RentalStatus.CANCELLED:
                return `
          color: #721c24;
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
        `;
            default:
                return `
          color: #856404;
          background-color: #fff3cd;
          border: 1px solid #ffeeba;
        `;
        }
    }}
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
`;

const ReturnButton = styled.button`
  padding: 7px 12px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s ease-in-out;

  &:hover {
    background-color: #0056b3;
  }
`;