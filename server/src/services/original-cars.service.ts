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

import { LoggerService } from './logger.service';

@Injectable()
export class OriginalCarsService {
  constructor(
    @InjectRepository(OriginalCar)
    private originalCarsRepository: Repository<OriginalCar>,
    private readonly loggerService: LoggerService,
  ) {}

  async createOriginalCar(
    createCarDto: CreateOriginalCarDto,
  ): Promise<OriginalCar> {
    try {
      const car = this.originalCarsRepository.create(createCarDto);
      return this.originalCarsRepository.save(car);
    } catch (error) {
      this.loggerService.error(
        `Error creating original car: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async createOriginalCarTransaction(
    createCarDto: CreateOriginalCarDto,
    manager: EntityManager,
  ): Promise<OriginalCar> {
    try {
      const car = manager.create(OriginalCar, createCarDto);
      return manager.save(car);
    } catch (error) {
      this.loggerService.error(
        `Error creating original car: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findById(id: string): Promise<OriginalCar> {
    try {
      const car = await this.originalCarsRepository.findOne({ where: { id } });

      if (!car) {
        throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
      }

      return car;
    } catch (error) {
      this.loggerService.error(
        `Error finding original car by id: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(listCarsDto: QueryCarsDto): Promise<[OriginalCar[], number]> {
    try {
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
    } catch (error) {
      this.loggerService.error(
        `Error finding all original cars: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
