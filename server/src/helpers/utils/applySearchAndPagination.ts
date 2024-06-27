import { SelectQueryBuilder } from 'typeorm';

import { Order } from '@/types';

export function applySearchAndPagination<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: {
    search?: string;
    searchColumn?: string;
    page: number;
    limit: number;
    order: Order;
    sort: string;
    entityAlias: string;
  },
): SelectQueryBuilder<T> {
  const { search, searchColumn, page, limit, order, sort, entityAlias } =
    options;

  console.log(options)

  if (search && searchColumn) {
    queryBuilder.andWhere(
      `LOWER(${entityAlias}.${searchColumn}) LIKE LOWER(:search)`,
      {
        search: `%${search}%`,
      },
    );
  }

  const skip = (page - 1) * limit;

  queryBuilder.take(limit).skip(skip).orderBy(`${entityAlias}.${sort}`, order);

  return queryBuilder;
}
