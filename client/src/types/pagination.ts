export type PaginationDto = {
    page?: number;
    limit?: number;
    sort?: string;
    order?: Order
}

export type Order = 'ASC' | 'DESC';
