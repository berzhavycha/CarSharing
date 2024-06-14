import { PaginationDto } from '@dtos';
import { IsOptional, IsString } from 'class-validator';

export class QueryCarsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
