import { Test, TestingModule } from '@nestjs/testing';

import { RentalsController } from '@/controllers';
import { RentCarDto } from '@/dtos';
import { Rental } from '@/entities';
import { RentalsService } from '@/services';

import { mockRental, mockRentalsService, mockUser } from '../mocks';

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

      jest.spyOn(rentalsService, 'rentCar').mockResolvedValue(mockRental);

      const result = await rentalsController.createRental(rentCarDto, mockUser);

      expect(result).toBe(mockRental);
      expect(rentalsService.rentCar).toHaveBeenCalledWith(rentCarDto, mockUser);
    });
  });

  describe('getCurrentUserRental', () => {
    it('should get current user rental', async () => {
      const mockUserId = 'user123';

      jest
        .spyOn(rentalsService, 'findActiveByUserId')
        .mockResolvedValue(mockRental);

      const result = await rentalsController.getCurrentUserRental(mockUserId);

      expect(result).toBe(mockRental);
      expect(rentalsService.findActiveByUserId).toHaveBeenCalledWith(
        mockUserId,
      );
    });

    it('should return null if there is no active rental for a user', async () => {
      const mockUserId = 'user123';

      jest.spyOn(rentalsService, 'findActiveByUserId').mockResolvedValue(null);

      const result = await rentalsController.getCurrentUserRental(mockUserId);

      expect(result).toBe(null);
      expect(rentalsService.findActiveByUserId).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('getUserHistory', () => {
    it('should get user rental history', async () => {
      const mockUserId = 'user123';

      const mockRentals: Rental[] = [mockRental];

      jest
        .spyOn(rentalsService, 'findAllUserRentals')
        .mockResolvedValue(mockRentals);

      const result = await rentalsController.getUserHistory(mockUserId);

      expect(result).toBe(mockRentals);
      expect(rentalsService.findAllUserRentals).toHaveBeenCalledWith(
        mockUserId,
      );
    });
  });

  describe('returnCar', () => {
    it('should return a rented car', async () => {
      const mockRentalId = 'rental123';

      jest.spyOn(rentalsService, 'returnCar').mockResolvedValue(mockRental);

      const result = await rentalsController.returnCar(mockRentalId, mockUser);

      expect(result).toBe(mockRental);
      expect(rentalsService.returnCar).toHaveBeenCalledWith(
        mockRentalId,
        mockUser,
      );
    });
  });
});
