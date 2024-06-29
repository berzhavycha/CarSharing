import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../general';

export class QueryTransactionsDto extends PaginationDto {
    @IsOptional()
    @IsString()
    search?: string;
}
