import { Test, TestingModule } from '@nestjs/testing';

import { RentalsController } from '@/controllers';
import { QueryRentalsDto, RentCarDto } from '@/dtos';
import { Rental } from '@/entities';
import { RentalsService } from '@/services';

import { mockRentalsService } from '../mocks';
import { makeRental, makeUser } from '../utils';

describe('RentalsController', () => {
  let rentalsController: RentalsController;
  let rentalsService: RentalsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RentalsController],
      providers: [
        {
          provide: RentalsService,
          useValue: mockRentalsService,
        },
      ],
    }).compile();

    rentalsController = module.get<RentalsController>(RentalsController);
    rentalsService = module.get<RentalsService>(RentalsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(rentalsController).toBeDefined();
  });

  describe('createRental', () => {
    it('should create a new rental', async () => {
      const rentCarDto: RentCarDto = {
        carId: 'car-id-1',
        hours: 2,
        pickUpLocation: 'London',
        dropOffLocation: 'London',
      };

      const rental = makeRental()
      const user = makeUser()

      jest.spyOn(rentalsService, 'rentCar').mockResolvedValue(rental);

      const result = await rentalsController.createRental(rentCarDto, user);

      expect(result).toBe(rental);
    });
  });

  describe('getCurrentUserRental', () => {
    it('should get current user rental', async () => {
      const userId = 'user123';

      const rental = makeRental()

      jest
        .spyOn(rentalsService, 'findActiveByUserId')
        .mockResolvedValue(rental);

      const result = await rentalsController.getCurrentUserRental(userId);

      expect(result).toBe(rental);
      expect(rentalsService.findActiveByUserId).toHaveBeenCalledWith(
        userId,
      );
    });

    it('should return null if there is no active rental for a user', async () => {
      const mockUserId = 'user123';

      jest.spyOn(rentalsService, 'findActiveByUserId').mockResolvedValue(null);

      const result = await rentalsController.getCurrentUserRental(mockUserId);

      expect(result).toBe(null);
    });
  });

  describe('getUserHistory', () => {
    it('should get user rental history', async () => {
      const userId = 'user123';
      const queryDto: QueryRentalsDto = { page: 1, limit: 10 }

      const rental = makeRental()
      const rentalsResult: [Rental[], number] = [[rental], 1];

      jest
        .spyOn(rentalsService, 'findAllUserRentals')
        .mockResolvedValue(rentalsResult);

      const result = await rentalsController.getUserHistory(queryDto, userId);

      expect(result).toBe(rentalsResult);
    });
  });

  describe('returnCar', () => {
    it('should return a rented car', async () => {
      const rentalId = 'rental123';

      const user = makeUser()
      const rental = makeRental()
      const returnResult = { rental }

      jest.spyOn(rentalsService, 'returnCar').mockResolvedValue(returnResult);

      const result = await rentalsController.returnCar(rentalId, user);

      expect(result).toBe(returnResult);
    });
  });
});
