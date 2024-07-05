import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../general';

export class QueryRentalsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
