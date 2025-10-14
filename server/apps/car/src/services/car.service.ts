import {
  applySearchAndPagination,
  CorrelationManager,
  DEFAULT_ORDER,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  getFilterOptions,
} from '@app/shared';
import { CarEvents } from '@app/shared/contracts/car-events.contract';
import { FileCommands } from '@app/shared/contracts/file-commands.contracts';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { FilterOption } from '@app/shared/types/filter-options';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  DataSource,
  FindOneOptions,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { CreateCarDto, QueryCarsDto, UpdateCarDto } from '../dtos';
import { Car } from '../entities';
import { CarOutboxEntity } from '../entities/car-outbox.entity';
import {
  CAR_DEFAULT_ORDER_COLUMN,
  CAR_DEFAULT_SEARCH_COLUMN,
  CarStatus,
} from '../helpers/constants';
import {
  CAR_EVENTS_PRODUCER,
  FILE_COMMANDS_PRODUCER,
} from '../helpers/constants/providers';
import { carErrorMessages } from '../helpers/errors';

import { CarPhotoService } from './car-photo.service';

@Injectable()
export class CarService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private readonly correlationManager: CorrelationManager,
    private readonly carPhotoService: CarPhotoService,
    @Inject(CAR_EVENTS_PRODUCER)
    private readonly carEventsProducer: EventProducer<CarEvents>,
    @Inject(FILE_COMMANDS_PRODUCER)
    private readonly fileCommandsProducer: EventProducer<FileCommands>,
    private readonly dataSource: DataSource,
    // private readonly loggerService: LoggerService,
  ) {}

  async isCarAvailable(id: string): Promise<boolean> {
    const car = await this.findById(id);

    if (!car) return false;

    return car.status === CarStatus.AVAILABLE;
  }

  // make it transactional
  async createCar(
    createCarDto: CreateCarDto,
    fileData: Express.Multer.File[],
  ): Promise<Car> {
    try {
      const car = this.carsRepository.create({
        ...createCarDto,
        pictures: [],
      });

      const savedCar = await this.carsRepository.save(car);

      if (fileData && fileData.length > 0) {
        const correlationId = uuidv4();

        await this.correlationManager.storePendingRequest(
          correlationId,
          savedCar.id,
          'car_photos_upload',
        );

        const filesDto = fileData.map((file) => ({
          ...file,
          originalname: file.originalname,
          mimetype: file.mimetype,
          encoding: file.encoding,
          filename: file.filename,
          size: file.size,
          path: file.path,
          buffer: file.buffer.toString('base64'),
        }));

        await this.fileCommandsProducer.sendEvent({
          type: 'UPLOAD_FILES',
          data: {
            files: filesDto,
            metadata: {
              replyTo: Topics.CAR_EVENTS_CHANNEL_TOPIC,
              correlationId,
            },
          },
        });
      }

      return savedCar;
    } catch (error) {
      console.error('Error creating car:', error);
      throw error;
    }
  }

  // make it transactional
  async updateCar(
    id: string,
    updateCarDto: UpdateCarDto,
    newImages: Express.Multer.File[],
  ): Promise<Car> {
    try {
      const car = await this.findById(id);

      const imagesToDelete = car.pictures.filter(
        (picture) => !updateCarDto.existingImagesIds.includes(picture.id),
      );

      if (imagesToDelete.length > 0) {
        await Promise.all(
          imagesToDelete.map((img) => this.carPhotoService.removeFile(img.id)),
        );
        await this.fileCommandsProducer.sendEvent({
          type: 'DELETE_FILES',
          data: {
            filesToDelete: imagesToDelete.map((img) => ({ id: img.id })),
          },
        });
      }

      car.pictures = car.pictures.filter((picture) =>
        updateCarDto.existingImagesIds.includes(picture.id),
      );

      if (newImages && newImages.length > 0) {
        const correlationId = uuidv4();

        await this.correlationManager.storePendingRequest(
          correlationId,
          car.id,
          'car_photos_upload',
        );

        const filesDto = newImages.map((file) => ({
          ...file,
          originalname: file.originalname,
          mimetype: file.mimetype,
          encoding: file.encoding,
          filename: file.filename,
          size: file.size,
          path: file.path,
          buffer: file.buffer.toString('base64'),
        }));

        await this.fileCommandsProducer.sendEvent({
          type: 'UPLOAD_FILES',
          data: {
            files: filesDto,
            metadata: {
              replyTo: Topics.CAR_EVENTS_CHANNEL_TOPIC,
              correlationId,
            },
          },
        });
      }

      delete updateCarDto.pictures;
      delete updateCarDto.existingImagesIds;
      Object.assign(car, updateCarDto);

      return this.carsRepository.save(car);
    } catch (error) {
      console.error('Error updating car:', error);
      throw error;
    }
  }

  async bookCar(params: {
    carId: string;
    metadata: {
      correlationId?: string;
      replyTo?: string;
    };
    useOutbox?: boolean;
  }): Promise<void> {
    const { carId, metadata, useOutbox } = params;
    const { replyTo, correlationId } = metadata;
    const topic = replyTo ?? Topics.CAR_EVENTS_CHANNEL_TOPIC;

    try {
      await this.dataSource.transaction(async (manager) => {
        const car = await manager.findOne(Car, { where: { id: carId } });
        if (!car) throw new Error('Car not found');

        if (car.status === CarStatus.BOOKED) {
          throw new Error('Car already booked');
        }

        car.status = CarStatus.BOOKED;
        await manager.save(car);

        const event = {
          type: 'CAR_BOOKED' as const,
          data: {
            carId: car.id,
            metadata: {
              correlationId,
            },
          },
        };

        if (useOutbox) {
          await manager.save(CarOutboxEntity, {
            topic,
            eventType: event.type,
            payload: event.data,
            status: 'PENDING',
          });
        } else {
          await this.carEventsProducer.sendEvent(event, topic);
        }
      });
    } catch (error) {
      const failEvent = {
        type: 'CAR_BOOKING_REJECTED' as const,
        data: {
          carId,
          metadata: {
            correlationId,
          },
        },
      };

      if (params.useOutbox) {
        await this.dataSource.manager.save(CarOutboxEntity, {
          topic,
          eventType: failEvent.type,
          payload: failEvent.data,
          status: 'PENDING',
        });
      } else {
        await this.carEventsProducer.sendEvent(failEvent, topic);
      }

      throw error;
    }
  }

  async releaseCar(params: {
    carId: string;
    metadata: {
      correlationId?: string;
      replyTo?: string;
    };
    useOutbox?: boolean;
  }): Promise<void> {
    const { carId, metadata, useOutbox } = params;
    const { replyTo, correlationId } = metadata;
    const topic = replyTo ?? Topics.CAR_EVENTS_CHANNEL_TOPIC;

    try {
      await this.dataSource.transaction(async (manager) => {
        const car = await manager.findOne(Car, { where: { id: carId } });
        if (!car) throw new Error('Car not found');

        car.status = CarStatus.AVAILABLE;
        await manager.save(car);

        const event = {
          type: 'CAR_RELEASED' as const,
          data: {
            carId: car.id,
            metadata: {
              correlationId,
            },
          },
        };

        if (useOutbox) {
          await manager.save(CarOutboxEntity, {
            topic,
            eventType: event.type,
            payload: event.data,
            status: 'PENDING',
            partitionKey: correlationId,
          });
        } else {
          await this.carEventsProducer.sendEvent(event, topic);
        }
      });
    } catch (error) {
      const failEvent = {
        type: 'CAR_RELEASE_FAILED' as const,
        data: {
          carId,
          metadata: {
            correlationId,
          },
        },
      };

      if (params.useOutbox) {
        await this.dataSource.manager.save(CarOutboxEntity, {
          topic,
          eventType: failEvent.type,
          payload: failEvent.data,
          status: 'PENDING',
        });
      } else {
        await this.carEventsProducer.sendEvent(failEvent, topic);
      }

      throw error;
    }
  }

  async removeCar(id: string): Promise<void> {
    try {
      const car = await this.findById(id);

      if (car.status === CarStatus.BOOKED) {
        throw new BadRequestException(carErrorMessages.CAR_CANNOT_BE_DELETED);
      }

      await this.fileCommandsProducer.sendEvent({
        type: 'DELETE_FILES',
        data: {
          filesToDelete: car.pictures.map((img) => ({ id: img.id })),
        },
      });
      await this.carsRepository.remove(car);
    } catch (error) {
      // this.loggerService.error(
      //   `Error removing car: ${error.message}`,
      //   error.stack,
      // );
      console.log(error);
      throw error;
    }
  }

  async findById(id: string, options?: FindOneOptions<Car>): Promise<Car> {
    try {
      const car = await this.carsRepository.findOne({
        where: { id },
        relations: ['pictures'],
        ...options,
      });

      if (!car) {
        throw new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(id));
      }

      return car;
    } catch (error) {
      // this.loggerService.error(
      //   `Error finding car by id: ${error.message}`,
      //   error.stack,
      // );
      console.log(error);
      throw error;
    }
  }

  async findAll(listCarsDto: QueryCarsDto): Promise<[Car[], number]> {
    try {
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
    } catch (error) {
      // this.loggerService.error(
      //   `Error finding all cars: ${error.message}`,
      //   error.stack,
      // );
      console.log(error);
      throw error;
    }
  }

  async getFilterOptions(): Promise<{
    types: FilterOption<string>[];
    capacities: FilterOption<number>[];
    maxPrice: number;
  }> {
    try {
      const types = await getFilterOptions(this.carsRepository, 'type');
      const capacities = await getFilterOptions(
        this.carsRepository,
        'capacity',
      );

      const maxPriceResult = await this.carsRepository
        .createQueryBuilder('car')
        .select('MAX(car.pricePerHour)', 'maxPrice')
        .getRawOne();

      const maxPrice = maxPriceResult ? parseFloat(maxPriceResult.maxPrice) : 0;

      return { types, capacities, maxPrice };
    } catch (error) {
      // this.loggerService.error(
      //   `Error getting filter options: ${error.message}`,
      //   error.stack,
      // );
      console.log(error);
      throw error;
    }
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

    // this.loggerService.log(`Filters applied: ${JSON.stringify(listCarsDto)}`);
  }
}
