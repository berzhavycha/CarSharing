import { Test, TestingModule } from '@nestjs/testing';

import { CarsController } from '@/controllers';
import { QueryCarsDto, UpdateCarDto } from '@/dtos';
import { Car } from '@/entities';
import { CarStatus } from '@/helpers';
import { CarsService } from '@/services';

import { createCarDtoMock, mockCar, mockCarsService } from '../mocks';

describe('CarsController', () => {
  let carsService: CarsService;
  let carsController: CarsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarsController],
      providers: [
        {
          provide: CarsService,
          useValue: mockCarsService,
        },
      ],
    }).compile();

    carsService = module.get<CarsService>(CarsService);
    carsController = module.get<CarsController>(CarsController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(carsController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new car', async () => {
      const createdCar = {
        id: 'car-id',
        ...createCarDtoMock,
      } as Car;

      jest.spyOn(carsService, 'createCar').mockResolvedValue(createdCar);

      const dto = { ...createCarDtoMock, status: CarStatus.AVAILABLE };
      const result = await carsController.create(dto);

      expect(result).toBe(createdCar);
      expect(carsService.createCar).toHaveBeenCalledWith(dto);
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
      const cars: Car[] = [{ ...mockCar }, { ...mockCar, id: '2nd-car-id' }];

      jest.spyOn(carsService, 'findAll').mockResolvedValue(cars);

      const result = await carsController.findAll(listCarsDto);

      expect(result).toBe(cars);
      expect(carsService.findAll).toHaveBeenCalledWith(listCarsDto);
    });
  });

  describe('findAllAvailable', () => {
    it('should return list of available cars', async () => {
      const listCarsDto: QueryCarsDto = {
        search: 'query',
        page: 1,
        limit: 10,
        order: 'ASC',
        sort: 'model',
      };
      const availableCars: Car[] = [mockCar];

      jest
        .spyOn(carsService, 'findAllAvailable')
        .mockResolvedValue(availableCars);

      const result = await carsController.findAllAvailable(listCarsDto);

      expect(result).toBe(availableCars);
      expect(carsService.findAllAvailable).toHaveBeenCalledWith(listCarsDto);
    });
  });

  describe('findOne', () => {
    it('should return a car by ID', async () => {
      const carId = 'valid-car-id';
      const foundCar: Car = mockCar;

      jest.spyOn(carsService, 'findById').mockResolvedValue(foundCar);

      const result = await carsController.findOne(carId);

      expect(result).toBe(foundCar);
      expect(carsService.findById).toHaveBeenCalledWith(carId);
    });
  });

  describe('update', () => {
    it('should update a car', async () => {
      const carId = mockCar.id;

      const updateCarDtoMock: UpdateCarDto = {
        status: CarStatus.BOOKED,
      };

      const updatedCar = {
        ...mockCar,
        ...updateCarDtoMock,
      } as Car;

      jest.spyOn(carsService, 'updateCar').mockResolvedValue(updatedCar);

      const result = await carsController.update(carId, updateCarDtoMock);

      expect(result).toBe(updatedCar);
      expect(carsService.updateCar).toHaveBeenCalledWith(
        carId,
        updateCarDtoMock,
      );
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
