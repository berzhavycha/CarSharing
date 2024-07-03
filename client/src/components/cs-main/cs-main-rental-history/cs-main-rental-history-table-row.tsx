import { FC } from 'react';
import styled from 'styled-components';

import { TableCell, TableRow } from '@/components/cs-common';
import { Env } from '@/core';
import { formatDate, uppercaseFirstLetter } from '@/helpers';
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
            <TableCell>{rental.originalCar.pricePerHour}</TableCell>
            <TableCell>{formatDate(rental.rentalStart)}</TableCell>
            <TableCell>{rental.rentalEnd ? formatDate(rental.rentalEnd) : '-'}</TableCell>
            <TableCell>
                <StatusBadge $status={rental.status}>{uppercaseFirstLetter(rental.status)}</StatusBadge>
            </TableCell>
            <TableCell>
                <Buttons>
                    {rental.status === 'active' && (
                        <RemoveButton>Return Car</RemoveButton>
                    )}
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
  border: 2px solid
    ${(props): string => {
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

const Buttons = styled.div`
  display: flex;
  align-items: center;
`;


const RemoveButton = styled.button`
  padding: 7px 12px;
  border: none;
  border-radius: 4px;
  background-color: var(--maintained-text);
  color: white;
  cursor: pointer;
  margin-right: 5px;
  transition: var(--default-transition);

  &:hover {
    background-color: #aa2633;
  }
`;
