import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

import { CreateCarDto, QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car } from '@/entities';
import {
  applySearchAndPagination,
  CAR_DEFAULT_ORDER_COLUMN,
  CAR_DEFAULT_SEARCH_COLUMN,
  carErrorMessages,
  CarStatus,
  DEFAULT_ORDER,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  getFilterOptions,
} from '@/helpers';
import { FilterOption, UploadFile } from '@/types';
import { PublicFilesService } from './public-files.service';
import { LoggerService } from './logger.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private publicFilesService: PublicFilesService,
    private readonly loggerService: LoggerService
  ) { }

  async createCar(
    createCarDto: CreateCarDto,
    fileData: UploadFile[],
  ): Promise<Car> {
    try {
      const carPictures = await Promise.all(
        fileData.map((file) => this.publicFilesService.uploadPublicFile(file.imageBuffer, file.filename)),
      );

      const car = this.carsRepository.create({
        ...createCarDto,
        pictures: carPictures,
      });

      return this.carsRepository.save(car);
    } catch (error) {
      this.loggerService.error(`Error creating car: ${error.message}`, error.stack);
      throw error;
    }
  }

  async updateCar(
    id: string,
    updateCarDto: UpdateCarDto,
    newImages: UploadFile[],
  ): Promise<Car> {
    try {
      const car = await this.findById(id);

      const imagesToDelete = car.pictures.filter(
        (picture) => !updateCarDto.existingImagesIds.includes(picture.id),
      );

      await Promise.all(
        imagesToDelete.map((img) => this.publicFilesService.removeFile(img.id)),
      );

      const newCarPictures = await Promise.all(
        newImages.map((file) => this.publicFilesService.uploadPublicFile(file.imageBuffer, file.filename)),
      );

      car.pictures = [
        ...car.pictures.filter((picture) =>
          updateCarDto.existingImagesIds.includes(picture.id),
        ),
        ...newCarPictures,
      ];

      delete updateCarDto.pictures;
      delete updateCarDto.existingImagesIds;
      Object.assign(car, updateCarDto);

      return this.carsRepository.save(car);
    } catch (error) {
      this.loggerService.error(`Error updating car: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeCar(id: string): Promise<void> {
    try {
      const car = await this.findById(id);

      if (car.status === CarStatus.BOOKED) {
        throw new BadRequestException(carErrorMessages.CAR_CANNOT_BE_DELETED);
      }

      await this.carsRepository.remove(car);
    } catch (error) {
      this.loggerService.error(`Error removing car: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findById(id: string): Promise<Car> {
    try {
      const car = await this.carsRepository.findOne({
        where: { id },
        relations: ['rentals', 'pictures'],
      });

      if (!car) {
        throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
      }

      return car;
    } catch (error) {
      this.loggerService.error(`Error finding car by id: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(listCarsDto: QueryCarsDto): Promise<[Car[], number]> {
    try {
      const { search, page, limit, order, sort } = listCarsDto;

      const queryBuilder = this.carsRepository.createQueryBuilder('car');

      queryBuilder.leftJoinAndSelect('car.pictures', 'pictures');

      this.applyFilters(queryBuilder, listCarsDto);

      applySearchAndPagination(queryBuilder, {
        search,
        searchColumn: CAR_DEFAULT_SEARCH_COLUMN,
        page: page || DEFAULT_PAGINATION_PAGE,
        limit: limit || DEFAULT_PAGINATION_LIMIT,
        order: order || DEFAULT_ORDER,
        sort: sort || CAR_DEFAULT_ORDER_COLUMN,
        entityAlias: 'car',
      });

      return queryBuilder.getManyAndCount();
    } catch (error) {
      this.loggerService.error(`Error finding all cars: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getFilterOptions(): Promise<{
    types: FilterOption<string>[];
    capacities: FilterOption<number>[];
    maxPrice: number;
  }> {
    try {
      const types = await getFilterOptions(this.carsRepository, 'type');
      const capacities = await getFilterOptions(this.carsRepository, 'capacity');

      const maxPriceResult = await this.carsRepository
        .createQueryBuilder('car')
        .select('MAX(car.pricePerHour)', 'maxPrice')
        .getRawOne();

      const maxPrice = maxPriceResult ? parseFloat(maxPriceResult.maxPrice) : 0;

      return { types, capacities, maxPrice };
    } catch (error) {
      this.loggerService.error(`Error getting filter options: ${error.message}`, error.stack);
      throw error;
    }
  }

  private applyFilters(
    queryBuilder: SelectQueryBuilder<Car>,
    listCarsDto: QueryCarsDto,
  ): void {
    const { types, capacities, status, minPrice, maxPrice } = listCarsDto;
    if (types && types.length > 0) {
      queryBuilder.andWhere('car.type IN (:...types)', { types });
    }
    if (capacities && capacities.length > 0) {
      queryBuilder.andWhere('car.capacity IN (:...capacities)', { capacities });
    }
    if (status) {
      queryBuilder.andWhere('car.status = :status', { status });
    }
    if (minPrice !== undefined && maxPrice !== undefined) {
      queryBuilder.andWhere(
        'car.pricePerHour BETWEEN :minPrice AND :maxPrice',
        { minPrice, maxPrice },
      );
    }

    this.loggerService.log(`Filters applied: ${JSON.stringify(listCarsDto)}`);
  }
}
