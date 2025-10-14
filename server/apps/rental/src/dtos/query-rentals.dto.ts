import { PaginationDto } from '@app/shared/dto';
import { IsOptional, IsString } from 'class-validator';

export class QueryRentalsDto extends PaginationDto {
  @IsOptional()
  @IsString()
  search?: string;
}
