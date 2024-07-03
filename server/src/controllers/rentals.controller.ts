import {
  Body,
  Controller,
  Get,
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
  constructor(private readonly rentalsService: RentalsService) { }

  @Post()
  async createRental(
    @Body() rentCarDto: RentCarDto,
    @CurrentUser() user: User,
  ): Promise<Rental> {
    return this.rentalsService.rentCar(rentCarDto, user);
  }

  @Get('history')
  async getUserHistory(@Query() listRentalDto: QueryRentalsDto, @CurrentUser('id') id: string): Promise<[Rental[], number]> {
    return this.rentalsService.findAllUserRentals(id, listRentalDto);
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseUUIDPipe) id: string
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
  ): Promise<{ rental: Rental, penalty?: number, refund?: number }> {
    return this.rentalsService.returnCar(id, user);
  }
}
