import { IsArray, IsOptional, IsString } from 'class-validator';

import { PaginationDto } from '../general';

export class QueryCarsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  types?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  capacities?: string[];
}
