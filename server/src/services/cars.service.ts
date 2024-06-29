import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCarDto, LocalFileDto, QueryCarsDto, UpdateCarDto } from '@/dtos';
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
} from '@/helpers';

import { LocalFilesService } from './local-files.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private localFilesService: LocalFilesService,
  ) { }

  async createCar(
    createCarDto: CreateCarDto,
    fileData: LocalFileDto[],
  ): Promise<Car> {
    const carPictures = await Promise.all(
      fileData.map((file) => this.localFilesService.saveLocalFileData(file)),
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
    newImages: LocalFileDto[],
  ): Promise<Car> {
    const car = await this.findById(id);

    if (!car) {
      throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
    }

    const imagesToDelete = car.pictures.filter(
      (picture) => !updateCarDto.existingImagesIds.includes(picture.id)
    );

    for (const img of imagesToDelete) {
      await this.localFilesService.removeFile(img.id);
    }

    const newCarPictures = await Promise.all(
      newImages.map((file) => this.localFilesService.saveLocalFileData(file)),
    );

    car.pictures = [
      ...car.pictures.filter((picture) => updateCarDto.existingImagesIds.includes(picture.id)),
      ...newCarPictures,
    ];

    delete updateCarDto.pictures
    delete updateCarDto.existingImagesIds
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

  async findAllAvailable(listCarsDto: QueryCarsDto): Promise<[Car[], number]> {
    const { search, page, limit, order, sort } = listCarsDto;

    const queryBuilder = this.carsRepository.createQueryBuilder('car');

    queryBuilder.where('car.status = :status', {
      status: CarStatus.AVAILABLE,
    });

    queryBuilder.leftJoinAndSelect('car.pictures', 'pictures');

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
}
