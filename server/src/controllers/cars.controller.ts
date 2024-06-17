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
  async create(@Body() createCarDto: CreateCarDto): Promise<Car> {
    return this.carsService.createCar(createCarDto);
  }

  @Get()
  @UseGuards(RoleGuard(Roles.ADMIN))
  async findAll(@Query() listCarsDto: QueryCarsDto): Promise<Car[]> {
    return this.carsService.findAll(listCarsDto);
  }

  @Get(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Car> {
    return this.carsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
  ): Promise<Car> {
    return this.carsService.updateCar(id, updateCarDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.carsService.removeCar(id);
  }

  @Get('available')
  @UseGuards(JwtAuthGuard)
  async findAllAvailable(@Query() listCarsDto: QueryCarsDto): Promise<Car[]> {
    return this.carsService.findAllAvailable(listCarsDto);
  }
}
