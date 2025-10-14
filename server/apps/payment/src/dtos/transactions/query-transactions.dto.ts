import { PaginationDto } from '@app/shared/dto';
import { IsOptional, IsString } from 'class-validator';

export class QueryTransactionsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
