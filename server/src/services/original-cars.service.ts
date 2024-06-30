import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { CreateOriginalCarDto, QueryCarsDto } from '@/dtos';
import { OriginalCar } from '@/entities';
import {
  applySearchAndPagination,
  CAR_DEFAULT_ORDER_COLUMN,
  carErrorMessages,
  DEFAULT_ORDER,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '@/helpers';

@Injectable()
export class OriginalCarsService {
  constructor(
    @InjectRepository(OriginalCar)
    private originalCarsRepository: Repository<OriginalCar>,
  ) { }

  async createOriginalCar(
    createCarDto: CreateOriginalCarDto,
  ): Promise<OriginalCar> {
    const car = this.originalCarsRepository.create(createCarDto);
    return this.originalCarsRepository.save(car);
  }

  async createOriginalCarTransaction(
    createCarDto: CreateOriginalCarDto,
    manager: EntityManager,
  ): Promise<OriginalCar> {
    const car = manager.create(OriginalCar, createCarDto);
    return manager.save(car);
  }

  async findById(id: string): Promise<OriginalCar> {
    const car = await this.originalCarsRepository.findOne({ where: { id } });

    if (!car) {
      throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
    }

    return car;
  }

  async findAll(listCarsDto: QueryCarsDto): Promise<[OriginalCar[], number]> {
    const {
      search,
      page = DEFAULT_PAGINATION_PAGE,
      limit = DEFAULT_PAGINATION_LIMIT,
      order = DEFAULT_ORDER,
      sort = CAR_DEFAULT_ORDER_COLUMN,
    } = listCarsDto;

    const queryBuilder =
      this.originalCarsRepository.createQueryBuilder('original_car');

    applySearchAndPagination(queryBuilder, {
      search,
      page,
      limit,
      order,
      sort,
      entityAlias: 'original_car',
    });

    return queryBuilder.getManyAndCount();
  }
}
