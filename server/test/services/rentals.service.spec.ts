import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { RentCarDto } from '@/dtos';
import { Car, Rental, User } from '@/entities';
import {
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
  mockCar,
  mockCarsService,
  mockEntityManager,
  mockOriginalCar,
  mockOriginalCarsService,
  mockRental,
  mockUsersService,
  repositoryMock,
} from '../mocks';

describe('RentalsService', () => {
  let rentalsService: RentalsService;
  let rentalsRepository: Repository<Rental>;
  let carsService: CarsService;
  let originalCarsService: OriginalCarsService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RentalsService,
        {
          provide: getRepositoryToken(Rental),
          useValue: repositoryMock,
        },
        {
          provide: CarsService,
          useValue: mockCarsService,
        },
        {
          provide: OriginalCarsService,
          useValue: mockOriginalCarsService,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
      ],
    }).compile();

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
      const rentCarDto: RentCarDto = {
        carId: 'car-id-1',
        days: 2,
        pickUpLocation: 'London',
        dropOffLocation: 'London',
      };

      const user: User = { id: 'user-id-1', balance: 100 } as User;

      jest
        .spyOn(rentalsRepository, 'findOne')
        .mockResolvedValue({ ...mockRental, status: RentalStatus.ACTIVE });

      await expect(rentalsService.rentCar(rentCarDto, user)).rejects.toThrow(
        BadRequestException,
      );
      expect(rentalsRepository.findOne).toHaveBeenCalledWith({
        where: {
          user: { id: user.id },
          status: RentalStatus.ACTIVE,
        },
      });
    });

    it('should throw BadRequestException if the car is not available', async () => {
      const rentCarDto: RentCarDto = {
        carId: 'car-id-1',
        days: 2,
        pickUpLocation: 'London',
        dropOffLocation: 'London',
      };
      const user: User = { id: 'user-id-1', balance: 100 } as User;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(null);

      await expect(rentalsService.rentCar(rentCarDto, user)).rejects.toThrow(
        BadRequestException,
      );
      expect(carsService.findById).toHaveBeenCalledWith(rentCarDto.carId);
    });

    it('should throw BadRequestException if the user has insufficient balance', async () => {
      const rentCarDto: RentCarDto = {
        carId: 'car-id-1',
        days: 2,
        pickUpLocation: 'London',
        dropOffLocation: 'London',
      };

      const user: User = { id: 'user-id-1', balance: 10 } as User;

      const car = {
        ...mockCar,
        status: CarStatus.AVAILABLE,
        pricePerHour: 20,
      } as Car;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(car);

      await expect(rentalsService.rentCar(rentCarDto, user)).rejects.toThrow(
        BadRequestException,
      );
      expect(carsService.findById).toHaveBeenCalledWith(rentCarDto.carId);
    });

    it('should throw BadRequestException if the car is not available', async () => {
      const rentCarDto: RentCarDto = {
        carId: 'car-id-1',
        days: 2,
        pickUpLocation: 'London',
        dropOffLocation: 'London',
      };

      const user: User = { id: 'user-id-1', balance: 100 } as User;

      const car: Car = {
        ...mockCar,
        status: CarStatus.BOOKED,
        pricePerHour: 20,
      } as Car;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(car);

      await expect(rentalsService.rentCar(rentCarDto, user)).rejects.toThrow(
        BadRequestException,
      );
      expect(carsService.findById).toHaveBeenCalledWith(rentCarDto.carId);
    });

    it('should create a rental successfully', async () => {
      const rentCarDto: RentCarDto = {
        carId: 'car-id-1',
        days: 2,
        pickUpLocation: 'London',
        dropOffLocation: 'London',
      };

      const user: User = { id: 'user-id-1', balance: 1000 } as User;

      const car: Car = {
        ...mockCar,
        status: CarStatus.AVAILABLE,
        pricePerDay: 20,
      } as Car;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(carsService, 'findById').mockResolvedValue(car);
      jest
        .spyOn(mockEntityManager, 'transaction')
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(car)
              .mockResolvedValue(mockRental),
          });
        });

      jest.spyOn(rentalsRepository, 'create').mockReturnValue(mockRental);
      jest
        .spyOn(originalCarsService, 'createOriginalCarTransaction')
        .mockResolvedValue(mockOriginalCar);
      jest
        .spyOn(usersService, 'updateUserBalance')
        .mockResolvedValue(undefined);

      const result = await rentalsService.rentCar(rentCarDto, user);

      expect(result).toEqual(mockRental);
      expect(carsService.findById).toHaveBeenCalledWith(rentCarDto.carId);
      expect(
        originalCarsService.createOriginalCarTransaction,
      ).toHaveBeenCalledWith(car, expect.anything());
      expect(usersService.updateUserBalance).toHaveBeenCalledWith(
        {
          id: user.id,
          balanceDto: { amount: -40 },
          transactionType: TransactionType.RENTAL_PAYMENT,
          rental: mockRental,
        },
        expect.anything(),
      );
    });
  });

  describe('returnCar', () => {
    const mockNow = new Date('2023-01-01T12:00:00Z').getTime();

    beforeAll(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockNow);
    });

    afterAll(() => {
      jest.useRealTimers();
    });

    it('should throw BadRequestException if rental is not found', async () => {
      const rentalId = 'non-existing-id';
      const user = { id: 'user-id-1' } as User;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);

      await expect(rentalsService.returnCar(rentalId, user)).rejects.toThrow(
        BadRequestException,
      );
      expect(rentalsRepository.findOne).toHaveBeenCalledWith({
        where: { id: rentalId },
        relations: ['car', 'originalCar', 'user'],
      });
    });

    it('should throw BadRequestException if the car has already been returned', async () => {
      const rentalId = 'existing-id';
      const user = { id: 'user-id-1' } as User;

      const returnedRental = { ...mockRental, rentalEnd: new Date() } as Rental;

      jest
        .spyOn(rentalsRepository, 'findOne')
        .mockResolvedValue(returnedRental);

      await expect(rentalsService.returnCar(rentalId, user)).rejects.toThrow(
        BadRequestException,
      );
      expect(rentalsRepository.findOne).toHaveBeenCalledWith({
        where: { id: rentalId },
        relations: ['car', 'originalCar', 'user'],
      });
    });

    it('should return the car and provide a refund if returned within requested hours', async () => {
      const rentalId = 'existing-id';
      const user = { id: 'user-id-1' } as User;
      const RENTAL_HOURS = 35;
      const rentalStart = new Date(
        mockNow - RENTAL_HOURS * ONE_HOUR_MILLISECONDS,
      );
      const rental = {
        ...mockRental,
        rentalStart,
        requestedDays: 2,
        rentalEnd: null,
        car: { ...mockCar, pricePerDay: 200 },
      } as Rental;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(rental);
      jest
        .spyOn(mockEntityManager, 'transaction')
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(rental.car)
              .mockResolvedValue(rental),
          });
        });

      const result = await rentalsService.returnCar(rentalId, user);

      expect(result).toEqual(rental);
      expect(usersService.updateUserBalance).toHaveBeenCalledWith(
        {
          id: user.id,
          balanceDto: { amount: 108.33333333333334 },
          transactionType: TransactionType.REFUND,
          rental,
        },
        expect.anything(),
      );
      expect(rental.car.status).toBe(CarStatus.AVAILABLE);
      expect(rental.status).toBe(RentalStatus.CLOSED);
      expect(rental.rentalEnd).not.toBeNull();
    });

    it('should return the car and apply a penalty if returned after requested hours', async () => {
      const rentalId = 'existing-id';
      const user = { id: 'user-id-1' } as User;
      const RENTAL_HOURS = 27;
      const rentalStart = new Date(
        mockNow - RENTAL_HOURS * ONE_HOUR_MILLISECONDS,
      );
      const rental = {
        ...mockRental,
        rentalStart,
        requestedDays: 1,
        rentalEnd: null,
        car: { ...mockCar, pricePerDay: 200 },
      } as Rental;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(rental);
      jest
        .spyOn(mockEntityManager, 'transaction')
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(rental.car)
              .mockResolvedValue(rental),
          });
        });

      const result = await rentalsService.returnCar(rentalId, user);

      expect(result).toEqual(rental);
      expect(usersService.updateUserBalance).toHaveBeenCalledWith(
        {
          id: user.id,
          balanceDto: { amount: -25 },
          transactionType: TransactionType.PENALTY,
          rental,
        },
        expect.anything(),
      );
      expect(rental.car.status).toBe(CarStatus.AVAILABLE);
      expect(rental.status).toBe(RentalStatus.CLOSED);
      expect(rental.rentalEnd).not.toBeNull();
    });

    it('should return the car with no refund or penalty if returned at exact requested hours', async () => {
      const rentalId = 'existing-id';
      const user: User = { id: 'user-id-1' } as User;
      const rentalStart = new Date(mockNow - 48 * ONE_HOUR_MILLISECONDS);
      const rental = {
        ...mockRental,
        rentalStart,
        requestedDays: 2,
        rentalEnd: null,
        car: { ...mockCar, pricePerHour: 20 },
      } as Rental;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(rental);
      jest
        .spyOn(mockEntityManager, 'transaction')
        .mockImplementation(async (fn) => {
          return await fn({
            save: jest
              .fn()
              .mockResolvedValueOnce(rental.car)
              .mockResolvedValue(rental),
          });
        });

      const result = await rentalsService.returnCar(rentalId, user);

      expect(result).toEqual(rental);
      expect(usersService.updateUserBalance).not.toHaveBeenCalledWith(
        expect.anything(),
        expect.anything(),
      );
      expect(rental.car.status).toBe(CarStatus.AVAILABLE);
      expect(rental.status).toBe(RentalStatus.CLOSED);
      expect(rental.rentalEnd).not.toBeNull();
    });
  });

  describe('findActiveByUserId', () => {
    it('should return a rental when found', async () => {
      const mockUser = {
        id: 'user-id-1',
      } as User;

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(mockRental);

      const result = await rentalsService.findActiveByUserId(mockUser.id);

      expect(result).toEqual(mockRental);
      expect(rentalsRepository.findOne).toHaveBeenCalledWith({
        where: {
          status: RentalStatus.ACTIVE,
          user: {
            id: mockUser.id,
          },
        },
        relations: ['originalCar', 'user'],
      });
    });

    it('should return null when rental is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(null);

      const result = await rentalsService.findActiveByUserId(nonExistingId);
      expect(result).toBe(null);
      expect(rentalsRepository.findOne).toHaveBeenCalledWith({
        where: {
          status: RentalStatus.ACTIVE,
          user: {
            id: nonExistingId,
          },
        },
        relations: ['originalCar', 'user'],
      });
    });
  });

  describe('findAllUserRentals', () => {
    it('should return user rentals when found', async () => {
      const mockUser: User = {
        id: 'user-id-1',
      } as User;

      const userRentals = [
        mockRental,
        { ...mockRental, id: '2nd-rental' },
        { ...mockRental, id: '3rd-rental' },
      ];
      jest.spyOn(rentalsRepository, 'find').mockResolvedValue(userRentals);

      const result = await rentalsService.findAllUserRentals(mockUser.id);

      expect(result).toEqual(userRentals);
      expect(rentalsRepository.find).toHaveBeenCalledWith({
        where: {
          user: {
            id: mockUser.id,
          },
        },
        relations: ['originalCar'],
      });
    });
  });
});
