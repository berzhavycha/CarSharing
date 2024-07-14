import { FC } from 'react';

import {
  CSCommonNoData,
  HiddenSMTableHeader,
  SortIcon,
  Table,
  TableHeader,
} from '@/components/cs-common';
import { useSortColumn } from '@/hooks';
import { Transaction } from '@/types';

import { CSDashboardTransactionsTableRow } from './cs-dashboard-transactions-table-row';

type Props = {
  transactions: Transaction[];
  onSortChange: (sort: string) => void;
};

export const CSDashboardTransactionsTable: FC<Props> = ({ transactions, onSortChange }) => {
  const { sortState, setSortState, renderSortIcon } = useSortColumn();

  const handleSortChange = (sort: string): void => {
    const direction = sortState.sort === sort && sortState.direction === 'asc' ? 'desc' : 'asc';
    setSortState({ sort, direction });
    onSortChange(sort);
  };

  return (
    <>
      <Table>
        <thead>
          <tr>
            <TableHeader style={{ width: '2%' }}>No.</TableHeader>
            <HiddenSMTableHeader style={{ width: '30%' }}>Rental Id</HiddenSMTableHeader>
            <TableHeader style={{ width: '20%' }}>User</TableHeader>
            <TableHeader style={{ width: '5%' }} onClick={() => handleSortChange('amount')}>
              Amount<SortIcon>{renderSortIcon('amount')}</SortIcon>
            </TableHeader>
            <TableHeader style={{ width: '10%' }} onClick={() => handleSortChange('createdAt')}>
              Time<SortIcon>{renderSortIcon('createdAt')}</SortIcon>
            </TableHeader>
            <TableHeader style={{ width: '12%' }} onClick={() => handleSortChange('type')}>
              Type<SortIcon>{renderSortIcon('type')}</SortIcon>
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
