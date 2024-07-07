export enum OrderOptions {
  ASC = 'ASC',
  DESC = 'DESC',
}

export const DEFAULT_PAGINATION_PAGE = '1';
export const DEFAULT_PAGINATION_LIMIT = '10';
export const DEFAULT_PAGINATION_ORDER = OrderOptions.ASC;

export const defaultSearchParams = {
  page: DEFAULT_PAGINATION_PAGE,
  limit: DEFAULT_PAGINATION_LIMIT,
  search: '',
  sort: '',
  order: OrderOptions.ASC,
};

export const ELLIPSIS = '...';
export const DEFAULT_MAX_VISIBLE_PAGE_BTNS = 5;
