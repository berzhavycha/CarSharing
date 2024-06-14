import { Transform } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

import { Order } from '@shared';

import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '../constants';

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
