import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { CarsController } from '@/controllers';
import { QueryCarsDto } from '@/dtos';
import { Car } from '@/entities';
import { CarStatus } from '@/helpers';
import { CarsService } from '@/services';

import { testCarsService, testConfigService } from '../test-objects';
import { makeCar, makeCreateCarDto } from '../utils';

describe('CarsController', () => {
  let carsService: CarsService;
  let carsController: CarsController;
  let configService: ConfigService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: testCarsService,
        },
        {
          provide: ConfigService,
          useValue: testConfigService,
        },
      ],
    }).compile();

    carsService = module.get<CarsService>(CarsService);
    carsController = module.get<CarsController>(CarsController);
    configService = module.get<ConfigService>(ConfigService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(carsController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new car', async () => {
      const createdCar = makeCar();
      const createCarDto = makeCreateCarDto();

      jest.spyOn(configService, 'get').mockReturnValue('uploads');
      jest.spyOn(carsService, 'createCar').mockResolvedValue(createdCar);

      const dto = { ...createCarDto, status: CarStatus.AVAILABLE };
      const result = await carsController.create(dto, []);

      expect(result).toBe(createdCar);
    });
  });

  describe('findAll', () => {
    it('should return list of cars', async () => {
      const listCarsDto: QueryCarsDto = {
        search: 'query',
        page: 1,
        limit: 10,
        order: 'ASC',
        sort: 'model',
      };

      const car = makeCar();

      const cars: Car[] = [{ ...car }, { ...car, id: '2nd-car-id' }];

      jest.spyOn(carsService, 'findAll').mockResolvedValue([cars, cars.length]);

      const result = await carsController.findAll(listCarsDto);

      expect(result).toEqual([cars, cars.length]);
    });
  });

  describe('findOne', () => {
    it('should return a car by ID', async () => {
      const carId = 'valid-car-id';
      const foundCar = makeCar();

      jest.spyOn(carsService, 'findById').mockResolvedValue(foundCar);

      const result = await carsController.findOne(carId);

      expect(result).toBe(foundCar);
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      const car = makeCar();
      const carId = car.id;

      const updateCarDto = {
        status: CarStatus.BOOKED,
      };

      const updatedCar = makeCar({
        ...updateCarDto,
      });

      jest.spyOn(configService, 'get').mockReturnValue('uploads');
      jest.spyOn(carsService, 'updateCar').mockResolvedValue(updatedCar);

      const result = await carsController.update(carId, updateCarDto);

      expect(result).toBe(updatedCar);
    });
  });

  describe('remove', () => {
    it('should remove a car', async () => {
      const carId = 'valid-car-id';

      jest.spyOn(carsService, 'removeCar').mockResolvedValue(undefined);

      await carsController.remove(carId);

      expect(carsService.removeCar).toHaveBeenCalledWith(carId);
    });
  });
});
