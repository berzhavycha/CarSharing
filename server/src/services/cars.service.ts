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

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private publicFilesService: PublicFilesService,
  ) { }

  async createCar(
    createCarDto: CreateCarDto,
    fileData: UploadFile[],
  ): Promise<Car> {
    const carPictures = await Promise.all(
      fileData.map((file) => this.publicFilesService.uploadPublicFile(file.imageBuffer, file.filename)),
    );

    const car = this.carsRepository.create({
      ...createCarDto,
      pictures: carPictures,
    });

    return this.carsRepository.save(car);
  }

  async updateCar(
    id: string,
    updateCarDto: UpdateCarDto,
    newImages: UploadFile[],
  ): Promise<Car> {
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
  }

  async removeCar(id: string): Promise<void> {
    const car = await this.findById(id);

    if (car.status === CarStatus.BOOKED) {
      throw new BadRequestException(carErrorMessages.CAR_CANNOT_BE_DELETED);
    }

    await this.carsRepository.remove(car);
  }

  async findById(id: string): Promise<Car> {
    const car = await this.carsRepository.findOne({
      where: { id },
      relations: ['rentals', 'pictures'],
    });

    if (!car) {
      throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
    }

    return car;
  }

  async findAll(listCarsDto: QueryCarsDto): Promise<[Car[], number]> {
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
  }

  async getFilterOptions(): Promise<{
    types: FilterOption<string>[];
    capacities: FilterOption<number>[];
    maxPrice: number;
  }> {
    const types = await getFilterOptions(this.carsRepository, 'type');
    const capacities = await getFilterOptions(this.carsRepository, 'capacity');

    const maxPriceResult = await this.carsRepository
      .createQueryBuilder('car')
      .select('MAX(car.pricePerHour)', 'maxPrice')
      .getRawOne();

    const maxPrice = maxPriceResult ? parseFloat(maxPriceResult.maxPrice) : 0;

    return { types, capacities, maxPrice };
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
  }
}
