import { IsOptional, IsString, IsInt } from 'class-validator';
import { DEFAULT_PAGINATION_LIMIT, DEFAULT_PAGINATION_PAGE } from '../constants';
import { Order } from '@shared';
import { Transform } from 'class-transformer';

export class PaginationDto {
    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    @IsInt()
    page?: number = DEFAULT_PAGINATION_PAGE;

    @IsOptional()
    @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
    @IsInt()
    limit?: number = DEFAULT_PAGINATION_LIMIT;

    @IsOptional()
    @IsString()
    sort?: string;

    @IsOptional()
    @IsString()
    order?: Order;
}