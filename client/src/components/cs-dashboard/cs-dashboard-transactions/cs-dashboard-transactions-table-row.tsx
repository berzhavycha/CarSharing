import { FC } from 'react';
import styled from 'styled-components';

import { TableCell, TableRow } from '@/components/cs-common';
import { uppercaseFirstLetter } from '@/helpers';
import { Transaction } from '@/types';

type Props = {
    transaction: Transaction;
    index: number;
};

export const CSDashboardTransactionsTableRow: FC<Props> = ({
    transaction,
    index,
}) => {
    console.log(transaction)
    return (
        <TableRow key={transaction.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{transaction?.rental?.id ?? '-'}</TableCell>
            <TableCell>{transaction.user.firstName} {transaction.user.lastName}</TableCell>
            <TableCell>{transaction.amount}</TableCell>
            <TableCell>{'Dat'}</TableCell>
            <TableCell>
                <StatusBadge $status={transaction.type}>{uppercaseFirstLetter(transaction.type)}</StatusBadge>
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
