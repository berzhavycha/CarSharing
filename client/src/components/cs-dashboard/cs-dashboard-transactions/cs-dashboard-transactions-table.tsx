import { FC } from 'react';

import { CSCommonNoData, HiddenSMTableHeader, Table, TableHeader } from '@/components/cs-common';
import { Transaction } from '@/types';

import { CSDashboardTransactionsTableRow } from './cs-dashboard-transactions-table-row';

type Props = {
  transactions: Transaction[];
  onSortChange: (sort: string) => void;
};

export const CSDashboardTransactionsTable: FC<Props> = ({ transactions, onSortChange }) => {
  return (
    <>
      <Table>
        <thead>
          <tr>
            <TableHeader style={{ width: '2%' }}>No.</TableHeader>
            <HiddenSMTableHeader style={{ width: '30%' }}>Rental Id</HiddenSMTableHeader>
            <TableHeader style={{ width: '20%' }}>User</TableHeader>
            <TableHeader style={{ width: '5%' }} onClick={() => onSortChange('amount')}>
              Amount
            </TableHeader>
            <TableHeader style={{ width: '10%' }} onClick={() => onSortChange('createdAt')}>
              Time
            </TableHeader>
            <TableHeader style={{ width: '12%' }} onClick={() => onSortChange('type')}>
              Type
            </TableHeader>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={8}>
                <CSCommonNoData message="No transactions available" />
              </td>
            </tr>
          ) : (
            transactions.map((transaction, index) => (
              <CSDashboardTransactionsTableRow
                key={transaction.id}
                index={index}
                transaction={transaction}
              />
            ))
          )}
        </tbody>
      </Table>
    </>
  );
};

