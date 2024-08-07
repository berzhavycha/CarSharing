import { FC } from 'react';

import { Env } from '@/core';
import { defaultSearchParams } from '@/helpers';
import { Transaction } from '@/types';

import { CSCommonTableList } from '../../cs-common';

import { CSDashboardTransactionsTable } from './cs-dashboard-transactions-table';

const transactionsDefaultSearchParams = {
  ...defaultSearchParams,
  limit: Env.ADMIN_TRANSACTIONS_PAGINATION_LIMIT,
};

type LoadedData = {
  transactions: Transaction[];
  count: number;
};

export const CSDashboardTransactions: FC = () => {
  return (
    <CSCommonTableList<LoadedData>
      title="Transactions"
      searchPlaceholder="Search by user name and last name"
      defaultSearchParams={transactionsDefaultSearchParams}
      paginationLimit={Env.ADMIN_TRANSACTIONS_PAGINATION_LIMIT}
      renderTable={(data, onSortChange) => (
        <CSDashboardTransactionsTable
          transactions={data.transactions}
          onSortChange={onSortChange}
        />
      )}
    />
  );
};
