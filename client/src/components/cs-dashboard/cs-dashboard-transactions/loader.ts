import { defer, LoaderFunctionArgs, redirect } from 'react-router-dom';

import { Env } from '@/core';
import { extractPaginationParams } from '@/helpers';
import { fetchTransactions } from '@/services';
import { Transaction } from '@/types';

export type TransactionLoaderData = {
  transactions: Transaction[];
  totalPages: number;
};

export const transactionsLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<Response | ReturnType<typeof defer>> => {
  const url = new URL(request.url);
  const { queryDto, defaultSearchParams } = extractPaginationParams(url, Env.ADMIN_TRANSACTIONS_PAGINATION_LIMIT);

  if (defaultSearchParams) {
    return redirect(`${url.pathname}?${defaultSearchParams}`);
  }

  const data = fetchTransactions(queryDto);

  return defer({
    data,
  });
};
