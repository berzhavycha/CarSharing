import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '@/dtos';

export class QueryCarsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
