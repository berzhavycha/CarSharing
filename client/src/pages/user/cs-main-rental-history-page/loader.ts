import { defer, LoaderFunctionArgs, redirect } from 'react-router-dom';

import { Env } from '@/core';
import { extractPaginationParams } from '@/helpers';
import { fetchRentalHistory } from '@/services';
import { Rental } from '@/types';

export type RentalHistoryLoaderData = {
  transactions: Rental[];
  totalPages: number;
};

export const rentalHistoryLoader = async ({
  request,
}: LoaderFunctionArgs): Promise<Response | ReturnType<typeof defer>> => {
  const url = new URL(request.url);
  const { queryDto, defaultSearchParams } = extractPaginationParams(
    url,
    Env.USER_RENTAL_HISTORY_PAGINATION_LIMIT,
  );

  if (defaultSearchParams) {
    return redirect(`${url.pathname}?${defaultSearchParams}`);
  }

  const data = fetchRentalHistory(queryDto);

  return defer({
    data,
  });
};
