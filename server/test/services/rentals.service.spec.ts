import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { QueryRentalsDto } from '@/dtos';
import { PublicFile, Rental, User } from '@/entities';
import {
  applySearchAndPagination,
  CarStatus,
  ONE_HOUR_MILLISECONDS,
  RentalStatus,
  TransactionType,
} from '@/helpers';
import {
  CarsService,
  OriginalCarsService,
  RentalsService,
  UsersService,
} from '@/services';

import {
  makeCar,
  makeOriginalCar,
  makeRental,
  makeRentalDto,
  makeUser,
} from '../utils';
import { createMock } from '@golevelup/ts-jest';

jest.mock('../../src/helpers/utils/apply-search-and-pagination.ts', () => ({
  applySearchAndPagination: jest.fn(),
}));

describe('RentalsService', () => {
  let rentalsService: RentalsService;
  let rentalsRepository: Repository<Rental>;
  let carsService: CarsService;
  let originalCarsService: OriginalCarsService;
  let usersService: UsersService;
  let entityManager: EntityManager

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: getRepositoryToken(Rental),
          useValue: createMock<Repository<PublicFile>>(),
        },
      ],
    }).useMocker(createMock)
      .compile();

    entityManager = module.get<EntityManager>(EntityManager)
    rentalsService = module.get<RentalsService>(RentalsService);
    rentalsRepository = module.get<Repository<Rental>>(
      getRepositoryToken(Rental),
    );
    carsService = module.get<CarsService>(CarsService);
    originalCarsService = module.get<OriginalCarsService>(OriginalCarsService);
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(rentalsService).toBeDefined();
  });

  describe('rentCar', () => {
    it('should throw BadRequestException if user already has an active rental', async () => {
      const rentCarDto = makeRentalDto();
      const user = makeUser({ balance: 1000 });
      const rental = makeRental();

      jest
        .spyOn(rentalsRepository, 'findOne')
        .mockResolvedValue({ ...rental, status: RentalStatus.ACTIVE });

      await expect(rentalsService.rentCar(rentCarDto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if the car is not found', async () => {
      const rentCarDto = makeRentalDto();
      const user = makeUser({ balance: 1000 });

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(null);

      await expect(rentalsService.rentCar(rentCarDto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if the user has insufficient balance', async () => {
      const rentCarDto = makeRentalDto();
      const user = makeUser({ balance: 0 });
      const car = makeCar({
        status: CarStatus.AVAILABLE,
        pricePerHour: 20,
      });

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(car);

      await expect(rentalsService.rentCar(rentCarDto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if the car is not available', async () => {
      const rentCarDto = makeRentalDto();
      const user = makeUser({ balance: 0 });
      const car = makeCar({
        status: CarStatus.BOOKED,
        pricePerHour: 20,
      });

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(car);

      await expect(rentalsService.rentCar(rentCarDto, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should create a rental successfully', async () => {
      const rentCarDto = makeRentalDto();
      const user = makeUser({ balance: 1000 });
      const car = makeCar({
        pricePerHour: 20,
      });
      const originalCar = makeOriginalCar();
      const rental = makeRental();

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(car);
      (entityManager.transaction as jest.Mock)
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(car)
              .mockResolvedValue(rental),
          });
        });
      jest.spyOn(rentalsRepository, 'create').mockReturnValue(rental);
      jest
        .spyOn(originalCarsService, 'createOriginalCarTransaction')
        .mockResolvedValue(originalCar);
      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(undefined);

      const result = await rentalsService.rentCar(rentCarDto, user);

      expect(result).toEqual(rental);
    });

    it('should create a rental successfully and update user balance', async () => {
      const rentCarDto = makeRentalDto();
      const user = makeUser({ balance: 1000 });
      const car = makeCar({
        pricePerHour: 20,
      });
      const originalCar = makeOriginalCar();
      const rental = makeRental();

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(car);
      (entityManager.transaction as jest.Mock)
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(car)
              .mockResolvedValue(rental),
          });
        });
      jest.spyOn(rentalsRepository, 'create').mockReturnValue(rental);
      jest
        .spyOn(originalCarsService, 'createOriginalCarTransaction')
        .mockResolvedValue(originalCar);
      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(undefined);

      const result = await rentalsService.rentCar(rentCarDto, user);

      expect(result).toEqual(rental);
      expect(usersService.updateUserBalance).toHaveBeenCalledWith(
        {
          id: user.id,
          balanceDto: { amount: -40 },
          transactionType: TransactionType.RENTAL_PAYMENT,
          rental,
        },
        expect.anything(),
      );
    });
  });

  describe('returnCar', () => {
    const mockNow = new Date('2024-01-01T12:00:00Z').getTime();

    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockNow);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should throw BadRequestException if rental is not found', async () => {
      const rentalId = 'non-existing-id';
      const user = makeUser();

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);

      await expect(rentalsService.returnCar(rentalId, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if the car has already been returned', async () => {
      const rentalId = 'existing-id';
      const user = makeUser();
      const rental = makeRental();

      const returnedRental = { ...rental, rentalEnd: new Date() };

      jest
        .spyOn(rentalsRepository, 'findOne')
        .mockResolvedValue(returnedRental);

      await expect(rentalsService.returnCar(rentalId, user)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should return the car', async () => {
      const rentalId = 'existing-id';
      const user = makeUser();
      const RENT_ACTUAL_TIME_HOURS = 1.9;
      const rentalStart = new Date(
        mockNow - RENT_ACTUAL_TIME_HOURS * ONE_HOUR_MILLISECONDS,
      );
      const car = makeCar();
      const rental = makeRental({
        rentalStart,
        requestedHours: 4,
        rentalEnd: null,
        car: { ...car, pricePerHour: 20 },
      });

      const returnResult = { refund: 40, rental };

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(rental);
      (entityManager.transaction as jest.Mock)
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(rental.car)
              .mockResolvedValue(rental),
          });
        });
      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(undefined);

      const result = await rentalsService.returnCar(rentalId, user);

      expect(result).toEqual(returnResult);
      expect(rental.car.status).toBe(CarStatus.AVAILABLE);
      expect(rental.status).toBe(RentalStatus.CLOSED);
      expect(rental.rentalEnd).not.toBeNull();
    });

    it('should return the car and provide a refund if returned within requested hours', async () => {
      const rentalId = 'existing-id';
      const user = makeUser();
      const RENT_ACTUAL_TIME_HOURS = 1.9;
      const rentalStart = new Date(
        mockNow - RENT_ACTUAL_TIME_HOURS * ONE_HOUR_MILLISECONDS,
      );
      const car = makeCar();
      const rental = makeRental({
        rentalStart,
        requestedHours: 4,
        rentalEnd: null,
        car: { ...car, pricePerHour: 20 },
      });

      const returnResult = { refund: 40, rental };

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(rental);
      (entityManager.transaction as jest.Mock)
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(rental.car)
              .mockResolvedValue(rental),
          });
        });
      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(undefined);

      const result = await rentalsService.returnCar(rentalId, user);

      expect(result).toEqual(returnResult);
      expect(usersService.updateUserBalance).toHaveBeenCalledWith(
        {
          id: user.id,
          balanceDto: { amount: 40 },
          transactionType: TransactionType.REFUND,
          rental,
        },
        expect.anything(),
      );
    });

    it('should return the car and apply a penalty if returned after requested hours', async () => {
      const rentalId = 'existing-id';
      const user = { id: 'user-id-1' } as User;
      const RENT_ACTUAL_TIME_HOURS = 2.1;
      const rentalStart = new Date(
        mockNow - RENT_ACTUAL_TIME_HOURS * ONE_HOUR_MILLISECONDS,
      );
      const car = makeCar();
      const rental = makeRental({
        rentalStart,
        requestedHours: 2,
        rentalEnd: null,
        car: { ...car, pricePerHour: 20 },
      });

      const returnResult = { penalty: 20, rental };

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(rental);
      (entityManager.transaction as jest.Mock)
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(rental.car)
              .mockResolvedValue(rental),
          });
        });
      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(undefined);

      const result = await rentalsService.returnCar(rentalId, user);

      expect(result).toEqual(returnResult);
      expect(usersService.updateUserBalance).toHaveBeenCalledWith(
        {
          id: user.id,
          balanceDto: { amount: -20 },
          transactionType: TransactionType.PENALTY,
          rental,
        },
        expect.anything(),
      );
    });

    it('should return the car with no refund or penalty if returned at exact requested hours', async () => {
      const rentalId = 'existing-id';
      const user: User = { id: 'user-id-1' } as User;
      const REQUESTED_HOURS = 2;
      const rentalStart = new Date(
        mockNow - REQUESTED_HOURS * ONE_HOUR_MILLISECONDS,
      );
      const car = makeCar();
      const rental = makeRental({
        rentalStart,
        requestedHours: 2,
        rentalEnd: null,
        car: { ...car, pricePerHour: 20 },
      });

      const returnResult = { rental };

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(rental);
      (entityManager.transaction as jest.Mock)
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(car)
              .mockResolvedValue(rental),
          });
        });
      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(undefined);

      const result = await rentalsService.returnCar(rentalId, user);

      expect(result).toEqual(returnResult);
      expect(usersService.updateUserBalance).not.toHaveBeenCalled();
    });
  });

  describe('findActiveByUserId', () => {
    it('should return a rental when found', async () => {
      const user = makeUser();
      const rental = makeRental();

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(rental);

      const result = await rentalsService.findActiveByUserId(user.id);

      expect(result).toEqual(rental);
    });

    it('should return null when rental is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);

      const result = await rentalsService.findActiveByUserId(nonExistingId);
      expect(result).toBe(null);
    });
  });

  describe('findAllUserRentals', () => {
    it('should return user rentals when found', async () => {
      const paginationResult: [Rental[], number] = [[
        makeRental({ id: '1st-rental' }),
        makeRental({ id: '2nd-rental' }),
        makeRental({ id: '3rd-rental' }),
      ], 3];
      const queryBuilder = createMock<SelectQueryBuilder<Rental>>()

      jest.spyOn(queryBuilder, 'where').mockReturnThis()
      jest.spyOn(queryBuilder, 'leftJoinAndSelect').mockReturnThis()
      jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue(paginationResult)
      jest.spyOn(rentalsRepository, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const mockApplySearchAndPagination = applySearchAndPagination as jest.Mock;
      mockApplySearchAndPagination.mockImplementation((qb) => qb);

      const queryDto: QueryRentalsDto = {};
      const result = await rentalsService.findAllUserRentals('user-id', queryDto);

      expect(result).toEqual(paginationResult);
    });
  });
});
