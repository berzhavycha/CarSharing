import { Order } from '@/types';
import { SelectQueryBuilder } from 'typeorm';

export function applySearchAndPagination<T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: {
        search?: string;
        page: number;
        limit: number;
        order: Order;
        sort: string;
        entityAlias: string;
    }
): SelectQueryBuilder<T> {
    const { search, page, limit, order, sort, entityAlias } = options;

    if (search) {
        queryBuilder.andWhere(`${entityAlias}.model LIKE :name`, { name: `%${search}%` });
    }

    const skip = (page - 1) * limit;

    queryBuilder
        .take(limit)
        .skip(skip)
        .orderBy(`${entityAlias}.${sort}`, order);

    return queryBuilder;
}
