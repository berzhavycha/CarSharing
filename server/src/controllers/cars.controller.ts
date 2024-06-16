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
import { JwtAuthGuard, RoleGuard } from '@/guards';
import { Roles } from '@/helpers';
import { CarsService } from '@/services';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  @Post()
  @UseGuards(RoleGuard(Roles.ADMIN))
  create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carsService.createCar(createCarDto);
  }

  @Get()
  @UseGuards(RoleGuard(Roles.ADMIN))
  findAll(@Query() listCarsDto: QueryCarsDto): Promise<Car[]> {
    return this.carsService.findAll(listCarsDto);
  }

  @Get(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Car> {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    return this.carsService.updateCar(id, updateCarDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.carsService.removeCar(id);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard) 
  findAllAvailable(@Query() listCarsDto: QueryCarsDto): Promise<Car[]> {
    return this.carsService.findAllAvailable(listCarsDto);
  }
}
