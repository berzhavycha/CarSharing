import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CurrentUser } from '@/decorators';
import { RentCarDto } from '@/dtos';
import { Rental, User } from '@/entities';
import { RoleGuard } from '@/guards';
import { Roles } from '@/helpers';
import { RentalsService } from '@/services';

@Controller('rentals')
@UseGuards(RoleGuard(Roles.USER))
export class RentalsController {
  constructor(private readonly rentalsService: RentalsService) {}

  @Post()
  async rentCar(
    @Body() rentCarDto: RentCarDto,
    @CurrentUser() user: User,
  ): Promise<Rental> {
    return this.rentalsService.rentCar(rentCarDto, user);
  }

  @Get('/current')
  async getCurrentRental(@CurrentUser('id') id: string): Promise<Rental | null> {
    return this.rentalsService.findActiveByUserId(id);
  }
  
  @Get('/history')
  async getUserHistory(@CurrentUser('id') id: string): Promise<Rental[]> {
    return this.rentalsService.findAllUserRentals(id);
  }
 
  @Patch('/:id/return')
  async returnCar(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<Rental> {
    return this.rentalsService.returnCar(id, user);
  }
}
