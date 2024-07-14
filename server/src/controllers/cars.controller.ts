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
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

import { CreateCarDto, QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car } from '@/entities';
import { JwtAuthGuard, RoleGuard } from '@/guards';
import {
  defaultFileFilter,
  defaultFileLimits,
  MAX_CAR_PICTURES,
  Roles,
} from '@/helpers';
import { CarsService } from '@/services';
import { FilterOption } from '@/types';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(RoleGuard(Roles.ADMIN))
  @UseInterceptors(
    FilesInterceptor('pictures', MAX_CAR_PICTURES, {
      fileFilter: defaultFileFilter,
      limits: defaultFileLimits,
    }),
  )
  async create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() pictures: Express.Multer.File[],
  ): Promise<Car> {
    const uploadedFiles =
      pictures?.map((file) => ({
        imageBuffer: file.buffer,
        filename: file.originalname,
      })) || [];

    return this.carsService.createCar(createCarDto, uploadedFiles);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@Query() listCarsDto: QueryCarsDto): Promise<[Car[], number]> {
    return this.carsService.findAll(listCarsDto);
  }

  @Get('filter-options')
  @UseGuards(JwtAuthGuard)
  async getFilterOptions(): Promise<{
    types: FilterOption<string>[];
    capacities: FilterOption<number>[];
    maxPrice: number;
  }> {
    return this.carsService.getFilterOptions();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Car> {
    return this.carsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  @UseInterceptors(
    FilesInterceptor('pictures', MAX_CAR_PICTURES, {
      fileFilter: defaultFileFilter,
      limits: defaultFileLimits,
    }),
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
    @UploadedFiles() pictures?: Express.Multer.File[],
  ): Promise<Car> {
    const uploadedFiles =
      pictures?.map((file) => ({
        imageBuffer: file.buffer,
        filename: file.originalname,
      })) || [];

    return this.carsService.updateCar(id, updateCarDto, uploadedFiles);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.carsService.removeCar(id);
  }
}
