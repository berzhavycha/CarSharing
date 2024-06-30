import { FC } from 'react';
import { CSDashboardListView } from '../cs-dashboard-list-view';
import { Env } from '@/core';
import { defaultSearchParams } from '@/helpers';
import { CSDashboardTransactionsTable } from './cs-dashboard-transactions-table';
import { Transaction } from '@/types';

const transactionsDefaultSearchParams = {
    ...defaultSearchParams,
    limit: Env.ADMIN_TRANSACTIONS_PAGINATION_LIMIT,
};

type LoadedData = {
    transactions: Transaction[],
    count: number
}

export const CSDashboardTransactions: FC = () => {
    return (
        <CSDashboardListView<LoadedData>
            title="Transactions"
            searchPlaceholder="Search by user name and last name"
            defaultSearchParams={transactionsDefaultSearchParams}
            paginationLimit={Env.ADMIN_TRANSACTIONS_PAGINATION_LIMIT}
            renderTable={(data, onSortChange) => (
                <CSDashboardTransactionsTable transactions={data.transactions} onSortChange={onSortChange} />
            )}
        />
    );
};