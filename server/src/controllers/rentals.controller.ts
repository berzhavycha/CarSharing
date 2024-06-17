import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common';

import { RoleGuard } from '@/guards';
import { RentalsService } from '@/services';
import { Roles } from '@/helpers';
import { CurrentUser } from '@decorators';
import { Rental, User } from '@/entities';
import { RentCarDto } from '@/dtos';

@Controller('rentals')
@UseGuards(RoleGuard(Roles.USER))
export class RentalsController {
    constructor(private readonly rentalsService: RentalsService) { }

    @Post()
    async rentCar(@Body() rentCarDto: RentCarDto, @CurrentUser() user: User): Promise<Rental> {
        return this.rentalsService.rentCar(rentCarDto, user)
    }

    @Put('/:id/return')
    async returnCar(@Param('id') id: string, @CurrentUser() user: User): Promise<Rental> {
        return this.rentalsService.returnCar(id, user);
    }

    @Get('/current')
    async getCurrentRental(@CurrentUser('id') id: string): Promise<Rental> {
        return this.rentalsService.findByUserId(id)
    }

    @Get('/history')
    async getUserHistory(@CurrentUser('id') id: string): Promise<Rental[]> {
        return this.rentalsService.findAllUserRentals(id)
    }
}
