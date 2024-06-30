import { SelectQueryBuilder } from 'typeorm';

import { Order } from '@/types';

export function applySearchAndPagination<T>(
  queryBuilder: SelectQueryBuilder<T>,
  options: {
    page: number;
    limit: number;
    order: Order;
    sort: string;
    entityAlias: string;
    search?: string;
    searchColumn?: string;
    searchColumns?: string[];
  },
): SelectQueryBuilder<T> {
  const {
    search,
    searchColumn,
    searchColumns,
    page,
    limit,
    order,
    sort,
    entityAlias,
  } = options;

  if (search && searchColumns && searchColumns.length > 0) {
    const searchConditions = searchColumns
      .map((column) => {
        const [table, field] = column.split('.');
        return `LOWER("${table}"."${field}") LIKE LOWER(:search)`;
      })
      .join(' OR ');

    queryBuilder.andWhere(`(${searchConditions})`, {
      search: `%${search}%`,
    });
  } else if (search && searchColumn) {
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
