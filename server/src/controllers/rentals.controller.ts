import {
  Body,
  Controller,
  Get,
  Param,
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

  @Get('current')
  async getCurrentUserRental(
    @CurrentUser('id') id: string,
  ): Promise<Rental | null> {
    return this.rentalsService.findActiveByUserId(id);
  }

  @Get('history')
  async getUserHistory(@Query() listRentalDto: QueryRentalsDto, @CurrentUser('id') id: string): Promise<[Rental[], number]> {
    return this.rentalsService.findAllUserRentals(id, listRentalDto);
  }

  @Patch(':id')
  async returnCar(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Rental> {
    return this.rentalsService.returnCar(id, user);
  }
}
