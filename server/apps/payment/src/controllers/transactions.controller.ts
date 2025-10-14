import { Roles } from '@app/shared';
import { RoleGuard } from '@app/shared/guards/roles.guard';
import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';

import { QueryTransactionsDto } from '../dtos';
import { Transaction } from '../entity/transaction.entity';
import { TransactionsService } from '../services/transaction.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/health')
  health() {
    return { status: 'UP' };
  }

  @Get()
  @UseGuards(RoleGuard([Roles.ADMIN, Roles.USER]))
  async findAll(
    @Query() query: QueryTransactionsDto,
  ): Promise<[Transaction[], number]> {
    return this.transactionsService.findAll(query);
  }

  @Get('user/:userId')
  @UseGuards(RoleGuard([Roles.ADMIN, Roles.USER]))
  async findByUser(
    @Param('userId') userId: string,
    @Query() query: QueryTransactionsDto,
  ): Promise<[Transaction[], number]> {
    return this.transactionsService.findByUser(userId, query);
  }

  @Get('rental/:rentalId')
  @UseGuards(RoleGuard([Roles.ADMIN, Roles.USER]))
  async findByRental(
    @Param('rentalId') rentalId: string,
    @Query() query: QueryTransactionsDto,
  ): Promise<[Transaction[], number]> {
    return this.transactionsService.findByRental(rentalId, query);
  }
}
