import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '@/decorators';
import { QueryRentalsDto, RentCarDto } from '@/dtos';
import { Rental, User } from '@/entities';
import { RoleGuard } from '@/guards';
import { Roles } from '@/helpers';
import { RentalsService } from '@/services';

@Controller('rentals')
@UseGuards(RoleGuard(Roles.USER))
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  async createRental(
    @Body() rentCarDto: RentCarDto,
    @CurrentUser() user: User,
    @Headers('idempotency-key') idempotencyKey?: string,
  ): Promise<Rental> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required.');
    }
    return this.rentalsService.rentCar(rentCarDto, user, idempotencyKey);
  }

  @Get('history')
  async getUserHistory(
    @Query() listRentalDto: QueryRentalsDto,
    @CurrentUser('id') id: string,
  ): Promise<[Rental[], number]> {
    return this.rentalsService.findAllUserRentals(id, listRentalDto);
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

  @Patch(':id')
  async returnCar(
    @Param('id') id: string,
    @CurrentUser() user: User,
    @Headers('idempotency-key') idempotencyKey?: string,
  ): Promise<{ rental: Rental; penalty?: number; refund?: number }> {
    if (!idempotencyKey) {
      throw new BadRequestException('Idempotency-Key header is required.');
    }
    return this.rentalsService.returnCar(id, user, idempotencyKey);
  }
}