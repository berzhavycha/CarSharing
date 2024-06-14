import { IsOptional, IsString, IsInt } from 'class-validator';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '../constants';
import { Order } from '@shared';

export class PaginationDto {
    @IsOptional()
    @IsInt()
    page?: number = DEFAULT_PAGINATION_PAGE;

    @IsOptional()
    @IsInt()
    limit?: number = DEFAULT_PAGINATION_LIMIT;

    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsString()
    order?: Order;
}