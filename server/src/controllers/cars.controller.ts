import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { CreateCarDto, QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car } from '@/entities';
import { RoleGuard } from '@/guards';
import { Roles } from '@/helpers';
import { CarsService } from '@/services';

@Controller('cars')
@UseGuards(RoleGuard(Roles.ADMIN))
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carsService.createCar(createCarDto);
  }

  @Get()
  findAll(@Query() listCarsDto: QueryCarsDto): Promise<Car[]> {
    return this.carsService.findAll(listCarsDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Car> {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    return this.carsService.updateCar(id, updateCarDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.carsService.removeCar(id);
  }
}
