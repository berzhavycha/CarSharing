import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../general';

export class QueryCarsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
