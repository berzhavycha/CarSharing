import {
  applySearchAndPagination,
  DEFAULT_ORDER,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  ONE_HOUR_MILLISECONDS,
} from '@app/shared';
import { RentalCommands } from '@app/shared/contracts/rental-commands.contract';
import { RentalEvents } from '@app/shared/contracts/rental-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { filter, map, Observable, Subject } from 'rxjs';
import { DataSource, EntityManager, Repository } from 'typeorm';

import { QueryRentalsDto } from '../dtos/query-rentals.dto';
import { RentCarDto } from '../dtos/rent-car.dto';
import { RentalOutboxEntity } from '../entities/rental-outbox.entity';
import { Rental } from '../entities/rental.entity';
import {
  RENTAL_DEFAULT_ORDER_COLUMN,
  RENTAL_DEFAULT_SEARCH_COLUMN,
  RentalStatus,
} from '../helpers/constants';
import { RENTAL_EVENTS_PRODUCER } from '../helpers/constants/providers';
import { rentalsErrorMessages } from '../helpers/errors';

const logger = new Logger('RentalsService');

@Injectable()
export class RentalsService {
  constructor(
    @InjectRepository(Rental)
    private rentalsRepository: Repository<Rental>,
    @InjectRepository(RentalOutboxEntity)
    private rentalOutboxRepository: Repository<RentalOutboxEntity>,
    private readonly entityManager: EntityManager,
    @Inject(RENTAL_EVENTS_PRODUCER)
    private readonly eventProducer: EventProducer<RentalEvents>,
    @Inject(RENTAL_EVENTS_PRODUCER)
    private readonly commandProducer: EventProducer<RentalCommands>,
    private readonly dataSource: DataSource,
  ) {}

  private rentalUpdates$ = new Subject<{
    userId: string;
    rentalId: string;
    status: string;
    reason?: string;
  }>();

  emitRentalUpdate(update: {
    userId: string;
    rentalId: string;
    status: string;
    reason?: string;
  }): void {
    try {
      if (!this.rentalUpdates$) {
        logger.error('[SSE] rentalUpdates$ subject is undefined!');
        return;
      }

      logger.debug(`[SSE] Emitting rental update: ${JSON.stringify(update)}`);
      this.rentalUpdates$.next(update);
    } catch (err) {
      logger.error(
        `[SSE] Failed to emit rental update: ${(err as Error).message}`,
        (err as Error).stack,
      );
    }
  }

  getRentalUpdates(userId: string): Observable<MessageEvent> {
    return this.rentalUpdates$.pipe(
      filter((update) => update.userId === userId),
      map((update) => new MessageEvent('message', { data: update })),
    );
  }

  async createRental(
    rentCarDto: RentCarDto,
    user: { id: string },
    useOutbox: boolean,
  ): Promise<Rental> {
    const existingActiveUserRental = await this.rentalsRepository.findOne({
      where: {
        userId: user.id,
        status: RentalStatus.ACTIVE,
      },
    });

    if (existingActiveUserRental) {
      throw new BadRequestException(
        rentalsErrorMessages.USER_HAVE_ACTIVE_RENTAL,
      );
    }

    const totalPrice = rentCarDto.hours * rentCarDto.pricePerHour;

    const rental = this.rentalsRepository.create({
      pickUpLocation: rentCarDto.pickUpLocation,
      dropOffLocation: rentCarDto.dropOffLocation,
      status: RentalStatus.PENDING,
      requestedHours: rentCarDto.hours,
      rentalStart: new Date(),
      userId: user.id,
      carId: rentCarDto.carId,
      pricePerHour: rentCarDto.pricePerHour,
      totalPrice,
    });

    const savedRental = await this.rentalsRepository.save(rental);

    const event = {
      type: 'RENTAL_CREATED' as const,
      data: {
        id: rental.id,
        rentalId: savedRental.id,
        carId: rentCarDto.carId,
        userId: user.id,
        pickUpLocation: rentCarDto.pickUpLocation,
        dropOffLocation: rentCarDto.dropOffLocation,
        totalPrice: savedRental.totalPrice,
        requestedHours: savedRental.requestedHours,
        rentalStart: savedRental.rentalStart,
        metadata: {
          correlationId: savedRental.id,
        },
      },
    };

    if (useOutbox) {
      await this.dataSource.transaction(async (manager) => {
        await manager.insert(RentalOutboxEntity, {
          topic: Topics.RENT_CAR_EVENTS_CHANNEL_TOPIC,
          eventType: event.type,
          payload: event.data as Record<string, unknown>,
          status: 'PENDING',
          partitionKey: savedRental.id,
        });
      });
    } else {
      await this.eventProducer.sendEvent(
        event,
        Topics.RENTAL_EVENTS_CHANNEL_TOPIC,
      );
    }

    return savedRental;
  }

  async findById(id: string): Promise<Rental> {
    return this.rentalsRepository.findOneBy({ id });
  }

  async cancelRental(params: {
    rentalId: string;
    correlationId?: string;
    replyTo?: string;
    useOutbox?: boolean;
  }): Promise<Rental> {
    const { rentalId, correlationId, replyTo, useOutbox } = params;

    const rental = await this.findById(rentalId);
    if (!rental)
      throw new NotFoundException(`Rental with id ${rentalId} not found`);

    rental.status = RentalStatus.CANCELLED;
    await this.rentalsRepository.update(
      { id: rental.id },
      { status: rental.status },
    );

    const event = {
      type: 'RENTAL_CANCELLED' as keyof RentalEvents,
      data: {
        rentalId: rental.id,
        metadata: {
          correlationId,
        },
      },
    };

    if (useOutbox) {
      await this.rentalOutboxRepository.save({
        topic: Topics.RENTAL_EVENTS_CHANNEL_TOPIC,
        eventType: event.type,
        payload: event.data,
        status: 'PENDING',
        partitionKey: correlationId,
      });
    } else {
      await this.eventProducer.sendEvent(
        event,
        replyTo ?? Topics.RENTAL_EVENTS_CHANNEL_TOPIC,
      );
    }

    return rental;
  }

  async confirmRental(params: {
    rentalId: string;
    correlationId?: string;
    replyTo?: string;
    useOutbox?: boolean;
  }): Promise<Rental> {
    const { rentalId, correlationId, replyTo, useOutbox } = params;

    const rental = await this.findById(rentalId);
    if (!rental) {
      throw new NotFoundException(`Rental with id ${rentalId} not found`);
    }

    rental.status = RentalStatus.ACTIVE;
    await this.rentalsRepository.update(
      { id: rental.id },
      { status: rental.status },
    );

    const event = {
      type: 'RENTAL_CONFIRMED' as keyof RentalEvents,
      data: {
        rentalId: rental.id,
        metadata: {
          correlationId,
        },
      },
    };

    if (useOutbox) {
      await this.rentalOutboxRepository.save({
        topic: Topics.RENTAL_EVENTS_CHANNEL_TOPIC,
        eventType: event.type,
        payload: event.data,
        status: 'PENDING',
        partitionKey: correlationId,
      });
    } else {
      await this.eventProducer.sendEvent(
        event,
        replyTo ?? Topics.RENTAL_EVENTS_CHANNEL_TOPIC,
      );
    }

    return rental;
  }

  async returnCar(
    id: string,
  ): Promise<{ rental: Rental; refund?: number; penalty?: number }> {
    const rental = await this.findById(id);

    if (rental.status === RentalStatus.CLOSED) {
      throw new BadRequestException(`Rental with id ${id} is already closed`);
    }

    const { refund, penalty } = this.calculatePenaltyOrRefund(
      rental,
      new Date(),
    );

    await this.commandProducer.sendEvent(
      {
        type: 'RETURN_CAR',
        data: {
          refund,
          penalty,
          carId: rental.carId,
          rentalId: id,
          userId: rental.userId,
          metadata: {
            correlationId: rental.id,
          },
        },
      },
      Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
    );

    return {
      rental,
      refund,
      penalty,
    };
  }

  async failReturnCar(params: {
    rentalId: string;
    correlationId?: string;
    replyTo?: string;
    useOutbox?: boolean;
  }): Promise<Rental> {
    const { rentalId, correlationId, replyTo, useOutbox } = params;

    const rental = await this.findById(rentalId);
    if (!rental) {
      throw new NotFoundException(`Rental with id ${rentalId} not found`);
    }

    rental.status = RentalStatus.RETURN_FAILED;
    await this.rentalsRepository.update(
      { id: rental.id },
      { status: rental.status },
    );

    const event = {
      type: 'RENTAL_RETURN_MARK_FAILED' as keyof RentalEvents,
      data: {
        rentalId: rental.id,
        metadata: {
          correlationId,
        },
      },
    };

    if (useOutbox) {
      await this.rentalOutboxRepository.save({
        topic: Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
        eventType: event.type,
        payload: event.data,
        status: 'PENDING',
        partitionKey: correlationId,
      });
    } else {
      await this.eventProducer.sendEvent(
        event,
        replyTo ?? Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
      );
    }

    return rental;
  }

  calculatePenaltyOrRefund(
    rental: Rental,
    returnDate: Date,
  ): { refund?: number; penalty?: number } {
    const hoursDifference = Math.ceil(
      (returnDate.getTime() - rental.rentalStart.getTime()) /
        ONE_HOUR_MILLISECONDS,
    );

    if (hoursDifference < rental.requestedHours) {
      const refund =
        rental.pricePerHour *
        Math.ceil(rental.requestedHours - hoursDifference);

      return { refund };
    } else if (hoursDifference > rental.requestedHours) {
      const penalty =
        rental.pricePerHour *
        Math.ceil(hoursDifference - rental.requestedHours);

      return { penalty };
    }

    return {};
  }

  async completeRental(params: {
    rentalId: string;
    useOutbox?: boolean;
  }): Promise<Rental> {
    const { rentalId, useOutbox } = params;

    const rental = await this.findById(rentalId);
    if (!rental) {
      throw new NotFoundException(`Rental with id ${rentalId} not found`);
    }

    rental.status = RentalStatus.CLOSED;
    await this.rentalsRepository.update(
      { id: rental.id },
      { status: rental.status },
    );

    const event = {
      type: 'RENTAL_COMPLETED' as keyof RentalEvents,
      data: {
        rentalId: rental.id,
        metadata: {
          correlationId: rental.id,
        },
      },
    };

    if (useOutbox) {
      await this.rentalOutboxRepository.save({
        topic: Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
        eventType: event.type,
        payload: event.data,
        status: 'PENDING',
        partitionKey: rentalId,
      });
    } else {
      await this.eventProducer.sendEvent(
        event,
        Topics.RENTAL_EVENTS_CHANNEL_TOPIC,
      );
    }

    return rental;
  }

  async findActiveByUserId(userId: string): Promise<Rental | null> {
    return this.rentalsRepository.findOne({
      where: {
        status: RentalStatus.ACTIVE,
        userId,
      },
      // relations: ['originalCar', 'user'],
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
        .where('rental.userId = :userId', { userId });

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
      console.log(error);
      // this.loggerService.error(
      //   `Error finding all user rentals: ${error.message}`,
      //   error.stack,
      // );
      throw error;
    }
  }
}
