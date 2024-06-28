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

import { CreateCarDto, QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car } from '@/entities';
import { JwtAuthGuard, RoleGuard } from '@/guards';
import {
  defaultFileFilter,
  defaultLocalFileLimits,
  MAX_CAR_PICTURES,
  Roles,
} from '@/helpers';
import { LocalFilesInterceptor } from '@/interceptors';
import { CarsService } from '@/services';

@Controller('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Post()
  @UseGuards(RoleGuard(Roles.ADMIN))
  @UseInterceptors(
    LocalFilesInterceptor({
      maxCount: MAX_CAR_PICTURES,
      fieldName: 'pictures',
      path: '/cars',
      fileFilter: defaultFileFilter,
      limits: defaultLocalFileLimits,
    }),
  )
  async create(
    @Body() createCarDto: CreateCarDto,
    @UploadedFiles() pictures: Express.Multer.File[],
  ): Promise<Car> {
    return this.carsService.createCar(createCarDto, pictures);
  }

  @Get()
  @UseGuards(RoleGuard(Roles.ADMIN))
  async findAll(@Query() listCarsDto: QueryCarsDto): Promise<[Car[], number]> {
    return this.carsService.findAll(listCarsDto);
  }

  @Get('/available')
  @UseGuards(JwtAuthGuard)
  async findAllAvailable(
    @Query() listCarsDto: QueryCarsDto,
  ): Promise<[Car[], number]> {
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
      maxCount: MAX_CAR_PICTURES,
      fieldName: 'pictures',
      path: '/cars',
      fileFilter: defaultFileFilter,
      limits: defaultLocalFileLimits,
    }),
  )
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCarDto: UpdateCarDto,
    @UploadedFiles() files?: Express.Multer.File[],
  ): Promise<Car> {
    console.log(files);
    const uploadedFiles =
      files?.map((file) => ({
        path: file.path,
        filename: file.originalname,
        mimetype: file.mimetype,
      })) || [];

    return this.carsService.updateCar(id, updateCarDto, uploadedFiles);
  }

  @Delete(':id')
  @UseGuards(RoleGuard(Roles.ADMIN))
  async remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.carsService.removeCar(id);
  }
}
