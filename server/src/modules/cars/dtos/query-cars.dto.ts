import { IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '@shared';

export class QueryCarsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
