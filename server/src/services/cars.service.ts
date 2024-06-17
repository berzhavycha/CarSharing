import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCarDto, QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car } from '@/entities';
import {
  applySearchAndPagination,
  CAR_DEFAULT_ORDER_COLUMN,
  carErrorMessages,
  CarStatus,
  DEFAULT_ORDER,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  RentalStatus,
} from '@/helpers';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
  ) { }

  async createCar(createCarDto: CreateCarDto): Promise<Car> {
    const car = this.carsRepository.create(createCarDto);
    return this.carsRepository.save(car);
  }

  async updateCar(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.findById(id);

    Object.assign(car, updateCarDto);
    return this.carsRepository.save(car);
  }

  async removeCar(id: string): Promise<void> {
    const car = await this.findById(id)

    if (car.rentals.some((rental) => rental.status === RentalStatus.ACTIVE)) {
      throw new BadRequestException(carErrorMessages.CAR_CANNOT_BE_DELETED);
    }

    await this.carsRepository.remove(car);
  }

  async findById(id: string): Promise<Car> {
    const car = await this.carsRepository.findOne({ where: { id }, relations: ['rentals'] });

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
