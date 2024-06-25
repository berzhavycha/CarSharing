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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreateCarDto, QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car } from '@/entities';
import { JwtAuthGuard, RoleGuard } from '@/guards';
import { Roles, defaultFileFilter, defaultLocalFileLimits } from '@/helpers';
import { CarsService } from '@/services';
import { LocalFilesInterceptor } from '@/interceptors';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) { }

  @Post()
  @UseGuards(RoleGuard(Roles.ADMIN))
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'picture',
      path: '/cars',
      fileFilter: defaultFileFilter,
      limits: defaultLocalFileLimits
    }),
  )
  async create(@Body() createCarDto: CreateCarDto, @UploadedFile() file: Express.Multer.File): Promise<Car> {
    return this.carsService.createCar(createCarDto, file);
  }

  @Get()
  @UseGuards(RoleGuard(Roles.ADMIN))
  async findAll(@Query() listCarsDto: QueryCarsDto): Promise<Car[]> {
    return this.carsService.findAll(listCarsDto);
  }

  @Get('/available')
  @UseGuards(JwtAuthGuard)
  async findAllAvailable(@Query() listCarsDto: QueryCarsDto): Promise<Car[]> {
    return this.carsService.findAllAvailable(listCarsDto);
  }

  @Get(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Car> {
    return this.carsService.findById(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  @UseInterceptors(
    LocalFilesInterceptor({
      fieldName: 'picture',
      path: '/cars',
      fileFilter: defaultFileFilter,
      limits: defaultLocalFileLimits
    }),
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
    @UploadedFile() file?: Express.Multer.File
  ): Promise<Car> {
    const uploadedFile = file
      ? {
        path: file?.path,
        filename: file?.originalname,
        mimetype: file?.mimetype,
      }
      : null;

    return this.carsService.updateCar(id, updateCarDto, uploadedFile);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.carsService.removeCar(id);
  }
}
