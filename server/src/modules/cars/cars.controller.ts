import { Body, Controller, Param, ParseUUIDPipe, Patch, Post, Delete, Get } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dtos';
import { Car } from './entities';

@Controller('cars')
export class CarsController {
    constructor(private readonly carsService: CarsService) { }

    @Post()
    create(@Body() createCarDto: CreateCarDto): Promise<Car> {
        return this.carsService.createCar(createCarDto);
    }

    @Get(':id')
    findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Car> {
        return this.carsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id', ParseUUIDPipe) id: string, @Body() updateCarDto: UpdateCarDto): Promise<Car> {
        return this.carsService.updateCar(id, updateCarDto);
    }

    @Delete(':id')
    remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
        return this.carsService.removeCar(id);
    }
}
