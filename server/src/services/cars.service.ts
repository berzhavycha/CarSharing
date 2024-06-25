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
  RentalStatus,
} from '@/helpers';
import { LocalFilesService } from './local-files.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private localFilesService: LocalFilesService
  ) { }

  async createCar(createCarDto: CreateCarDto, fileData?: LocalFileDto): Promise<Car> {
    const carPicture = await this.localFilesService.saveLocalFileData(fileData);

    const car = this.carsRepository.create({
      ...createCarDto,
      picture: carPicture
    });

    return this.carsRepository.save(car);
  }

  async updateCar(id: string, updateCarDto: UpdateCarDto, fileData?: LocalFileDto): Promise<Car> {
    const car = await this.findById(id);

    if (updateCarDto.picture) {
      const updatedCarPicture = await this.localFilesService.saveLocalFileData(fileData);
      Object.assign(car, { picture: updatedCarPicture });
    }

    Object.assign(car, updateCarDto);
    return this.carsRepository.save(car);
  }

  async removeCar(id: string): Promise<void> {
    const car = await this.findById(id);

    if (car.rentals.some((rental) => rental.status === RentalStatus.ACTIVE)) {
      throw new BadRequestException(carErrorMessages.CAR_CANNOT_BE_DELETED);
    }

    await this.carsRepository.remove(car);
  }

  async findById(id: string): Promise<Car> {
    const car = await this.carsRepository.findOne({
      where: { id },
      relations: ['rentals', 'local_file'],
    });

    if (!car) {
      throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
    }

    return car;
  }

  async findAll(listCarsDto: QueryCarsDto): Promise<Car[]> {
    const {
      search,
      page = DEFAULT_PAGINATION_PAGE,
      limit = DEFAULT_PAGINATION_LIMIT,
      order = DEFAULT_ORDER,
      sort = CAR_DEFAULT_ORDER_COLUMN,
    } = listCarsDto;

    const queryBuilder = this.carsRepository.createQueryBuilder('car');

    applySearchAndPagination(queryBuilder, {
      search,
      searchColumn: CAR_DEFAULT_SEARCH_COLUMN,
      page,
      limit,
      order,
      sort,
      entityAlias: 'car',
    });

    return queryBuilder.getMany();
  }

  async findAllAvailable(listCarsDto: QueryCarsDto): Promise<Car[]> {
    const {
      search,
      page = DEFAULT_PAGINATION_PAGE,
      limit = DEFAULT_PAGINATION_LIMIT,
      order = DEFAULT_ORDER,
      sort = CAR_DEFAULT_ORDER_COLUMN,
    } = listCarsDto;

    const queryBuilder = this.carsRepository.createQueryBuilder('car');

    queryBuilder.where('car.status = :status', {
      status: CarStatus.AVAILABLE,
    });

    applySearchAndPagination(queryBuilder, {
      search,
      page,
      limit,
      order,
      sort,
      entityAlias: 'car',
    });

    return queryBuilder.getMany();
  }
}
