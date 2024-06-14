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
  CAR_DEFAULT_ORDER_COLUMN,
  carErrorMessages,
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
  ) {}

  async createCar(createCarDto: CreateCarDto): Promise<Car> {
    const car = this.carsRepository.create(createCarDto);
    return this.carsRepository.save(car);
  }

  async updateCar(id: string, updateCarDto: UpdateCarDto): Promise<Car> {
    const car = await this.carsRepository.preload({
      id: id,
      ...updateCarDto,
    });

    if (!car) {
      throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
    }

    return this.carsRepository.save(car);
  }

  async removeCar(id: string): Promise<void> {
    const car = await this.carsRepository.findOne({
      where: { id },
      relations: ['rentals'],
    });

    if (!car) {
      throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
    }

    if (car.rentals.some((rental) => rental.status === RentalStatus.ACTIVE)) {
      throw new BadRequestException(carErrorMessages.CAR_CANNOT_BE_DELETED);
    }

    await this.carsRepository.remove(car);
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carsRepository.findOne({ where: { id } });

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

    if (search) {
      queryBuilder.where('car.model LIKE :name', { name: `%${search}%` });
    }

    const skip = (page - 1) * limit;

    queryBuilder.take(limit).skip(skip).orderBy(`car.${sort}`, order);

    return queryBuilder.getMany();
  }
}
