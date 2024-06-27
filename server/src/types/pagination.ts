export type Order = 'ASC' | 'DESC';

export type PaginationResult<T> = {
    data: T[],
    count: number
}