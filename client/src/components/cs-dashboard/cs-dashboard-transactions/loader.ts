import { createSearchParams, defer, LoaderFunctionArgs, redirect } from 'react-router-dom';

import { Env } from '@/core';
import { DEFAULT_PAGINATION_ORDER, DEFAULT_PAGINATION_PAGE, OrderOptions } from '@/helpers';
import { fetchTransactions } from '@/services';
import { Order, Transaction } from '@/types';

export type TransactionLoaderData = {
    transactions: Transaction[];
    totalPages: number;
};

export const transactionsLoader = async ({
    request,
}: LoaderFunctionArgs): Promise<Response | ReturnType<typeof defer>> => {
    const url = new URL(request.url);
    const page = url.searchParams.get('page') || DEFAULT_PAGINATION_PAGE;
    const limit = url.searchParams.get('limit') || Env.ADMIN_TRANSACTIONS_PAGINATION_LIMIT;
    const search = url.searchParams.get('search') || '';
    const sort = url.searchParams.get('sort') || '';
    const order = (url.searchParams.get('order')?.toUpperCase() as Order) || DEFAULT_PAGINATION_ORDER;

    const isDefaultParamsNeeded = !url.searchParams.has('page') || !url.searchParams.has('limit');

    if (isDefaultParamsNeeded) {
        const defaultSearchParams = createSearchParams({
            page: page,
            limit: String(limit),
            ...(search && { search }),
            ...(sort && { sort }),
            ...(order !== OrderOptions.ASC && { order }),
        });

        return redirect(`${url.pathname}?${defaultSearchParams}`);
    }

    const queryDto = {
        page: Number(page),
        limit: Number(limit),
        search,
        sort,
        order,
    };

    const data = fetchTransactions(queryDto);

    return defer({
        data,
    });
};
