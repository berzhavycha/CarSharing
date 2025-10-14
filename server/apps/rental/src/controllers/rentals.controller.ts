import { CurrentUser, Roles } from '@app/shared';
import { RoleGuard } from '@app/shared/guards/roles.guard';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  Req,
  Sse,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express-serve-static-core';
import { filter, Observable } from 'rxjs';

import { QueryRentalsDto } from '../dtos/query-rentals.dto';
import { RentCarDto } from '../dtos/rent-car.dto';
import { Rental } from '../entities/rental.entity';
import {
  Car,
  RentalAggregatorService,
  Transaction,
} from '../services/rental-aggregator.service';
import { RentalsService } from '../services/rentals.service';

@Controller('rentals')
@UseGuards(RoleGuard([Roles.USER]))
export class RentalsController {
  constructor(
    private readonly rentalsService: RentalsService,
    private readonly rentalAggretorService: RentalAggregatorService,
  ) {}

  @Post()
  async createRental(
    @Body() rentCarDto: RentCarDto,
    @CurrentUser() user: { id: string },
  ): Promise<Rental> {
    return this.rentalsService.createRental(rentCarDto, user, true);
  }

  @Sse('stream/:userId')
  streamRentalUpdates(
    @Param('userId') userId: string,
  ): Observable<MessageEvent> {
    return this.rentalsService
      .getRentalUpdates(userId)
      .pipe(filter((event): event is MessageEvent => !!event));
  }

  @Sse('stream/:userId/return')
  streamRentalReturnUpdates(
    @Param('userId') userId: string,
  ): Observable<MessageEvent> {
    return this.rentalsService
      .getRentalUpdates(userId)
      .pipe(filter((event): event is MessageEvent => !!event));
  }

  @Get('history')
  async getUserHistory(
    @Req() req: Request,
    @Query() listRentalDto: QueryRentalsDto,
    @CurrentUser('id') id: string,
  ): Promise<
    [
      (Rental & {
        car: Car;
        transactions: Transaction[];
      })[],
      number,
    ]
  > {
    return this.rentalAggretorService.getPaginatedRentalsWithDetails(
      id,
      listRentalDto,
      req.cookies.tokens['accessToken'],
    );
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<Rental | null> {
    return this.rentalsService.findById(id);
  }

  @Get('current')
  async getCurrentUserRental(
    @CurrentUser('id') id: string,
  ): Promise<Rental | null> {
    return this.rentalsService.findActiveByUserId(id);
  }

  @Post(':id/return')
  async returnCar(
    @Param('id') id: string,
  ): Promise<{ rental: Rental; penalty?: number; refund?: number }> {
    return this.rentalsService.returnCar(id);
  }
}
