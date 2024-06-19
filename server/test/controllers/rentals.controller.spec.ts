import { Test, TestingModule } from '@nestjs/testing';
import { RentalsController } from '@/controllers';
import { RentalsService } from '@/services';
import { RentCarDto } from '@/dtos';
import { Rental } from '@/entities';
import { mockCar, mockRental, mockUser } from '../mocks';

const mockRentalsService = {
    rentCar: jest.fn(),
    findActiveByUserId: jest.fn(),
    findAllUserRentals: jest.fn(),
    returnCar: jest.fn(),
};

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
            const mockRentCarDto: RentCarDto = {
                carId: mockCar.id,
                hours: 2
            };

            jest.spyOn(rentalsService, 'rentCar').mockResolvedValue(mockRental);

            const result = await rentalsController.createRental(mockRentCarDto, mockUser);

            expect(result).toBe(mockRental);
            expect(rentalsService.rentCar).toHaveBeenCalledWith(mockRentCarDto, mockUser);
        });
    });

    describe('getCurrentUserRental', () => {
        it('should get current user rental', async () => {
            const mockUserId = 'user123';

            jest.spyOn(rentalsService, 'findActiveByUserId').mockResolvedValue(mockRental);

            const result = await rentalsController.getCurrentUserRental(mockUserId);

            expect(result).toBe(mockRental);
            expect(rentalsService.findActiveByUserId).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe('getUserHistory', () => {
        it('should get user rental history', async () => {
            const mockUserId = 'user123';

            const mockRentals: Rental[] = [mockRental];

            jest.spyOn(rentalsService, 'findAllUserRentals').mockResolvedValue(mockRentals);

            const result = await rentalsController.getUserHistory(mockUserId);

            expect(result).toBe(mockRentals);
            expect(rentalsService.findAllUserRentals).toHaveBeenCalledWith(mockUserId);
        });
    });

    describe('returnCar', () => {
        it('should return a rented car', async () => {
            const mockRentalId = 'rental123';

            jest.spyOn(rentalsService, 'returnCar').mockResolvedValue(mockRental);

            const result = await rentalsController.returnCar(mockRentalId, mockUser);

            expect(result).toBe(mockRental);
            expect(rentalsService.returnCar).toHaveBeenCalledWith(mockRentalId, mockUser);
        });
    });
});
