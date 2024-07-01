import { createSearchParams } from 'react-router-dom';
import { DEFAULT_PAGINATION_ORDER, DEFAULT_PAGINATION_PAGE, OrderOptions } from '@/helpers';
import { Order } from '@/types';

type QueryDto = {
    page: number;
    limit: number;
    search: string;
    sort: string;
    order: Order;
};

export const extractPaginationParams = (
    url: URL,
    defaultLimit: number | string
): { queryDto: QueryDto; defaultSearchParams: string | null } => {
    const page = url.searchParams.get('page') || DEFAULT_PAGINATION_PAGE;
    const limit = url.searchParams.get('limit') || defaultLimit;
    const search = url.searchParams.get('search') || '';
    const sort = url.searchParams.get('sort') || '';
    const order = (url.searchParams.get('order')?.toUpperCase() as Order) || DEFAULT_PAGINATION_ORDER;

    const isDefaultParamsNeeded = !url.searchParams.has('page') || !url.searchParams.has('limit');

    let defaultSearchParams: string | null = null;

    if (isDefaultParamsNeeded) {
        defaultSearchParams = createSearchParams({
            page: page,
            limit: String(limit),
            ...(search && { search }),
            ...(sort && { sort }),
            ...(order !== OrderOptions.ASC && { order }),
        }).toString();
    }

    const queryDto = {
        page: Number(page),
        limit: Number(limit),
        search,
        sort,
        order,
    };

    return { queryDto, defaultSearchParams };
};

