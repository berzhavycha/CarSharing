import { FC, Suspense } from 'react';
import { Await, useLoaderData } from 'react-router-dom';
import styled from 'styled-components';

import {
    CSCommonError,
    CSCommonSearchBar,
    CSCommonSpinner,
    Pagination,
} from '@/components/cs-common';
import { Env } from '@/core';
import { DEFAULT_PAGINATION_PAGE, OrderOptions, UNEXPECTED_ERROR_MESSAGE } from '@/helpers';
import { usePagination, useSearchParamsWithDefaults } from '@/hooks';

import { TransactionLoaderData } from './loader';
import { CSDashboardTransactionsTable } from './cs-dashboard-transactions-table';

const defaultSearchParams = {
    page: DEFAULT_PAGINATION_PAGE,
    limit: Env.ADMIN_TRANSACTIONS_PAGINATION_LIMIT,
    search: '',
    sort: '',
    order: OrderOptions.ASC,
};

export const CSDashboardTransactions: FC = () => {
    const data = useLoaderData() as { data: TransactionLoaderData };
    const { searchParams } = useSearchParamsWithDefaults(defaultSearchParams)
    const { onPageChange, onSearchChange, onSortChange } = usePagination(defaultSearchParams);

    return (
        <TransactionsContainer>
            <ContentContainer>
                <Header>
                    <h3>Transactions</h3>
                    <CSCommonSearchBar
                        search={searchParams.get('search') ?? ''}
                        onSearchChange={onSearchChange}
                        placeholder="Search by user name and last name"
                    />
                </Header>
                <Suspense fallback={<CSCommonSpinner />}>
                    <Await
                        resolve={data.data}
                        errorElement={<CSCommonError errorMessage={UNEXPECTED_ERROR_MESSAGE} />}
                    >
                        {(data) => {
                            const totalPages = Math.ceil(
                                data.total /
                                Number(searchParams.get('limit') ?? Env.ADMIN_CARS_PAGINATION_LIMIT),
                            )

                            return (
                                <>
                                    <CSDashboardTransactionsTable transactions={data.transactions} onSortChange={onSortChange} />
                                    {totalPages > 1 && (
                                        <Pagination
                                            totalPages={Math.ceil(
                                                data.total /
                                                Number(searchParams.get('limit') ?? Env.ADMIN_TRANSACTIONS_PAGINATION_LIMIT),
                                            )}
                                            currentPage={Number(searchParams.get('page')) || +DEFAULT_PAGINATION_PAGE}
                                            onPageChange={onPageChange}
                                        />
                                    )}
                                </>
                            )
                        }}
                    </Await>
                </Suspense>
            </ContentContainer>
        </TransactionsContainer>
    );
};

const TransactionsContainer = styled.div`
  width: 100%;
  max-height: 100vh;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  margin-bottom: 30px;
`;

const ContentContainer = styled.div`
  padding: 30px;
  background-color: white;
  margin: 20px;
  border-radius: 10px;
  box-shadow: var(--default-box-shadow);
  height: 94%;
`;
