import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { RentCarDto } from '@/dtos';
import { Rental, User } from '@/entities';
import {
  CarStatus,
  HOURS_IN_DAY,
  ONE_HOUR_MILLISECONDS,
  rentalsErrorMessages,
  RentalStatus,
  TransactionType,
} from '@/helpers';

import { CarsService } from './cars.service';
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
  ) {}

  async rentCar(rentCarDto: RentCarDto, user: User): Promise<Rental> {
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

    const rentalCost = car.pricePerDay * rentCarDto.days;
    if (user.balance < rentalCost) {
      throw new BadRequestException(rentalsErrorMessages.INSUFFICIENT_BALANCE);
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
        status: RentalStatus.ACTIVE,
        requestedDays: rentCarDto.days,
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
  }

  async returnCar(rentalId: string, user: User): Promise<Rental> {
    const rental = await this.rentalsRepository.findOne({
      where: { id: rentalId },
      relations: ['car', 'originalCar', 'user'],
    });

    if (!rental) {
      throw new BadRequestException(rentalsErrorMessages.RENTAL_NOT_FOUND);
    }

    if (rental.rentalEnd !== null) {
      throw new BadRequestException(rentalsErrorMessages.CAR_IS_RETURNED);
    }

    return this.entityManager.transaction(async (manager) => {
      const returnDate = new Date();
      const hoursDifference = Math.ceil(
        (returnDate.getTime() - rental.rentalStart.getTime()) /
          ONE_HOUR_MILLISECONDS,
      );

      const hoursInRequestedDays = rental.requestedDays * HOURS_IN_DAY;
      const pricePerHour = rental.car.pricePerDay / HOURS_IN_DAY;

      if (hoursDifference < hoursInRequestedDays) {
        const refundAmount =
          pricePerHour * (hoursInRequestedDays - hoursDifference);

        await this.usersService.updateUserBalance(
          {
            id: user.id,
            balanceDto: { amount: refundAmount },
            transactionType: TransactionType.REFUND,
            rental,
          },
          manager,
        );
      } else if (hoursDifference > hoursInRequestedDays) {
        const fineAmount =
          pricePerHour * (hoursDifference - hoursInRequestedDays);

        await this.usersService.updateUserBalance(
          {
            id: user.id,
            balanceDto: { amount: -fineAmount },
            transactionType: TransactionType.PENALTY,
            rental,
          },
          manager,
        );
      }

      rental.car.status = CarStatus.AVAILABLE;
      await manager.save(rental.car);

      rental.rentalEnd = returnDate;
      rental.status = RentalStatus.CLOSED;

      return manager.save(rental);
    });
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

  async findAllUserRentals(userId: string): Promise<Rental[]> {
    return this.rentalsRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: ['originalCar'],
    });
  }
}
