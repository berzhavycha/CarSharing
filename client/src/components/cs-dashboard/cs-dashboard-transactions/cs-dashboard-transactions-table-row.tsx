import { FC } from 'react';
import styled from 'styled-components';

import {
  CSCommonBaseStatusBadge,
  HiddenSMTableCell,
  TableCell,
  TableRow,
} from '@/components/cs-common';
import { convertToTitleCase, formatDate } from '@/helpers';
import { Transaction, TransactionType } from '@/types';

type Props = {
  transaction: Transaction;
  index: number;
};

export const CSDashboardTransactionsTableRow: FC<Props> = ({ transaction, index }) => {
  return (
    <TableRow key={transaction.id}>
      <TableCell>{index + 1}</TableCell>
      <HiddenSMTableCell>{transaction?.rental?.id ?? '-'}</HiddenSMTableCell>
      <TableCell>
        {transaction.user.firstName} {transaction.user.lastName}
      </TableCell>
      <TableCell>{Math.abs(transaction.amount)}</TableCell>
      <TableCell>{formatDate(transaction.createdAt)}</TableCell>
      <TableCell>
        <TypeBadge $status={transaction.type}>{convertToTitleCase(transaction.type)}</TypeBadge>
      </TableCell>
    </TableRow>
  );
};

const TypeBadge = styled(CSCommonBaseStatusBadge)<{ $status: TransactionType }>`
  color: ${(props): string => {
    switch (props.$status) {
      case TransactionType.TOP_UP:
        return 'var(--top-up-text)';
      case TransactionType.RENTAL_PAYMENT:
        return 'var(--rental-payment-text)';
      case TransactionType.REFUND:
        return 'var(--refund-text)';
      case TransactionType.PENALTY:
        return 'var(--penalty-text)';
      default:
        return 'var(--default-text)';
    }
  }};
  background-color: ${(props): string => {
    switch (props.$status) {
      case TransactionType.TOP_UP:
        return 'var(--top-up-bg)';
      case TransactionType.RENTAL_PAYMENT:
        return 'var(--rental-payment-bg)';
      case TransactionType.REFUND:
        return 'var(--refund-bg)';
      case TransactionType.PENALTY:
        return 'var(--penalty-bg)';
      default:
        return 'var(--default-bg)';
    }
  }};
  border: 2px solid
    ${(props): string => {
      switch (props.$status) {
        case TransactionType.TOP_UP:
          return 'var(--top-up-border)';
        case TransactionType.RENTAL_PAYMENT:
          return 'var(--rental-payment-border)';
        case TransactionType.REFUND:
          return 'var(--refund-border)';
        case TransactionType.PENALTY:
          return 'var(--penalty-border)';
        default:
          return 'var(--default-border)';
      }
    }};
`;
