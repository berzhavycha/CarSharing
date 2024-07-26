import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { QueryRentalsDto, RentCarDto } from '@/dtos';
import { Rental, User } from '@/entities';
import {
  applySearchAndPagination,
  CarStatus,
  DEFAULT_ORDER,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  ONE_HOUR_MILLISECONDS,
  RENTAL_DEFAULT_ORDER_COLUMN,
  RENTAL_DEFAULT_SEARCH_COLUMN,
  rentalsErrorMessages,
  RentalStatus,
  TransactionType,
} from '@/helpers';

import { CarsService } from './cars.service';
import { LoggerService } from './logger.service';
import { OriginalCarsService } from './original-cars.service';
import { UsersService } from './users.service';

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
    private carsService: CarsService,
    private originalCarsService: OriginalCarsService,
    private usersService: UsersService,
    private readonly entityManager: EntityManager,
    private readonly loggerService: LoggerService,
  ) { }

  async rentCar(rentCarDto: RentCarDto, user: User): Promise<Rental> {
    try {
      const existingActiveUserRental = await this.rentalsRepository.findOne({
        where: {
          user: { id: user.id },
          status: RentalStatus.ACTIVE,
        },
      });

      if (existingActiveUserRental) {
        throw new BadRequestException(
          rentalsErrorMessages.USER_HAVE_ACTIVE_RENTAL,
        );
      }

      const car = await this.carsService.findById(rentCarDto.carId);

      if (!car || car.status !== CarStatus.AVAILABLE) {
        throw new BadRequestException(rentalsErrorMessages.CAR_NOT_AVAILABLE);
      }

      const rentalCost = car.pricePerHour * rentCarDto.hours;
      if (user.balance < rentalCost) {
        throw new BadRequestException(
          rentalsErrorMessages.INSUFFICIENT_BALANCE,
        );
      }

      return this.entityManager.transaction(async (manager) => {
        const originalCar =
          await this.originalCarsService.createOriginalCarTransaction(
            car,
            manager,
          );

        car.status = CarStatus.BOOKED;
        await manager.save(car);

        const rental = this.rentalsRepository.create({
          car,
          user,
          originalCar,
          pickUpLocation: rentCarDto.pickUpLocation,
          dropOffLocation: rentCarDto.dropOffLocation,
          totalPrice: rentalCost,
          status: RentalStatus.ACTIVE,
          requestedHours: rentCarDto.hours,
          rentalStart: new Date(),
        });

        const createdRental = await manager.save(rental);

        await this.usersService.updateUserBalance(
          {
            id: user.id,
            balanceDto: { amount: -rentalCost },
            transactionType: TransactionType.RENTAL_PAYMENT,
            rental: createdRental,
          },
          manager,
        );

        return createdRental;
      });
    } catch (error) {
      this.loggerService.error(
        `Error renting car: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  private calculatePenaltyOrRefund(
    rental: Rental,
    returnDate: Date,
  ): { amount?: number; transactionType?: TransactionType } {
    const hoursDifference = Math.ceil(
      (returnDate.getTime() - rental.rentalStart.getTime()) /
      ONE_HOUR_MILLISECONDS,
    );

    if (hoursDifference < rental.requestedHours) {
      const refund =
        rental.car.pricePerHour *
        Math.ceil(rental.requestedHours - hoursDifference);

      return { amount: refund, transactionType: TransactionType.REFUND };
    } else if (hoursDifference > rental.requestedHours) {
      const penalty =
        rental.car.pricePerHour *
        Math.ceil(hoursDifference - rental.requestedHours);

      return { amount: penalty, transactionType: TransactionType.PENALTY };
    }

    return {};
  }

  async getRentalToReturn(id: string): Promise<Rental> {
    const rental = await this.rentalsRepository.findOne({
      where: { id },
      relations: ['car', 'originalCar', 'user'],
    });

    if (!rental) {
      throw new BadRequestException(rentalsErrorMessages.RENTAL_NOT_FOUND);
    }

    if (rental.rentalEnd !== null) {
      throw new BadRequestException(rentalsErrorMessages.CAR_IS_RETURNED);
    }

    return rental
  }

  async returnCar(
    rentalId: string,
    user: User,
  ): Promise<{ rental: Rental; penalty?: number; refund?: number }> {
    try {
      const rental = await this.getRentalToReturn(rentalId)

      return this.entityManager.transaction(async (manager) => {
        const returnDate = new Date();
        const { amount, transactionType } = this.calculatePenaltyOrRefund(
          rental,
          returnDate,
        );

        if (amount && transactionType) {
          await this.usersService.updateUserBalance(
            {
              id: user.id,
              balanceDto: { amount: transactionType === TransactionType.PENALTY ? -amount : amount },
              transactionType,
              rental,
            },
            manager,
          );
        }

        rental.car.status = CarStatus.AVAILABLE;
        await manager.save(rental.car);

        rental.rentalEnd = returnDate;
        rental.status = RentalStatus.CLOSED;

        const updatedRental = await manager.save(rental);

        return {
          rental: updatedRental,
          penalty: transactionType === TransactionType.PENALTY ? amount : undefined,
          refund: transactionType === TransactionType.REFUND ? amount : undefined
        };
      });
    } catch (error) {
      this.loggerService.error(
        `Error returning car: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findActiveByUserId(userId: string): Promise<Rental | null> {
    return this.rentalsRepository.findOne({
      where: {
        status: RentalStatus.ACTIVE,
        user: {
          id: userId,
        },
      },
      relations: ['originalCar', 'user'],
    });
  }

  async findById(id: string): Promise<Rental | null> {
    return this.rentalsRepository.findOne({
      where: {
        id,
      },
      relations: [
        'originalCar',
        'user',
        'originalCar.pictures',
        'transactions',
      ],
    });
  }

  async findAllUserRentals(
    userId: string,
    query: QueryRentalsDto,
  ): Promise<[Rental[], number]> {
    try {
      const { search, page, limit, order, sort } = query;

      const queryBuilder = this.rentalsRepository
        .createQueryBuilder('rental')
        .leftJoinAndSelect('rental.originalCar', 'originalCar')
        .leftJoinAndSelect('rental.transactions', 'transactions')
        .leftJoinAndSelect('originalCar.pictures', 'publicFile')
        .where('rental.user.id = :userId', { userId });

      applySearchAndPagination(queryBuilder, {
        search,
        searchColumns: RENTAL_DEFAULT_SEARCH_COLUMN,
        page: page || DEFAULT_PAGINATION_PAGE,
        limit: limit || DEFAULT_PAGINATION_LIMIT,
        order: order || DEFAULT_ORDER,
        sort: sort || RENTAL_DEFAULT_ORDER_COLUMN,
        entityAlias: 'rental',
      });

      return queryBuilder.getManyAndCount();
    } catch (error) {
      this.loggerService.error(
        `Error finding all user rentals: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
