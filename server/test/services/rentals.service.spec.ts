import { Test } from '@nestjs/testing'
import { CarsService, OriginalCarsService, RentalsService, UsersService } from '@/services';
import { OriginalCar, Rental, User } from '@/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { repositoryMock, mockCar, mockOriginalCar, mockRental } from '../mocks';
import { RentCarDto } from '@/dtos';
import { BadRequestException } from '@nestjs/common';
import { RentalStatus } from '@/helpers';

const mockCarsService = {
    findById: jest.fn()
}

const mockOriginalCarsService = {
    createOriginalCarTransaction: jest.fn()
}

const mockUsersService = {
    updateUserBalance: jest.fn()
}

const mockEntityManager = {
    create: jest.fn(),
    save: jest.fn(),
};

describe('Rentals', () => {
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
        rentalsRepository = module.get<Repository<Rental>>(getRepositoryToken(Rental));
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


    describe('findActiveByUserId', () => {
        it('should return a rental when found', async () => {
            const mockUser: User = {
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

        it('should throw NotFoundException when rental is not found', async () => {
            const nonExistingId = 'non-existing-id'

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

            const userRentals = [mockRental, { ...mockRental, id: '2nd-rental' }, { ...mockRental, id: '3rd-rental' }]
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

    // describe('rentCar', () => {
    //     it('should create a rental successfully', async () => {
    //         const mockUser: User = {
    //             id: 'user-id-1',
    //             balance: 1000,
    //         } as User;

    //         const rentCarDto: RentCarDto = {
    //             carId: mockCar.id,
    //             hours: 2,
    //         };

    //         jest.spyOn(rentalsRepository, 'findOne').mockReturnValue(null);
    //         jest.spyOn(carsService, 'findById').mockResolvedValue(mockCar);
    //         jest.spyOn(originalCarsService, 'createOriginalCarTransaction').mockResolvedValue(mockOriginalCar);
    //         jest.spyOn(rentalsRepository, 'create').mockReturnValue(mockRental);
    //         jest.spyOn(rentalsRepository, 'save').mockResolvedValue(mockRental);
    //         jest.spyOn(usersService, 'updateUserBalance').mockResolvedValue(null);

    //         const result = await rentalsService.rentCar(rentCarDto, mockUser);

    //         expect(result).toBeDefined();
    //         expect(result.user).toEqual(mockUser);
    //         expect(result.car).toEqual(mockCar);
    //         expect(result.requestedHours).toEqual(rentCarDto.hours);
    //         expect(result.status).toEqual(RentalStatus.ACTIVE);
    //         expect(result.rentalStart).toBeInstanceOf(Date);
    //         expect(usersService.updateUserBalance).toHaveBeenCalled();
    //     });

    //     // it('should throw BadRequestException if user has an active rental', async () => {
    //     //     const mockUser: User = {
    //     //         id: 'user-id-1',
    //     //         balance: 100,
    //     //     } as User;

    //     //     const existingRental: Rental = {
    //     //         id: 'rental-id-1',
    //     //         user: mockUser,
    //     //         status: 'ACTIVE',
    //     //     } as Rental;

    //     //     jest.spyOn(rentalsRepository, 'findOne').mockResolvedValue(existingRental);

    //     //     const rentCarDto: RentCarDto = {
    //     //         carId: 'car-id-1',
    //     //         hours: 2,
    //     //     };

    //     //     await expect(service.rentCar(rentCarDto, mockUser)).rejects.toThrow(BadRequestException);
    //     // });

    //     // it('should throw BadRequestException if car is not available', async () => {
    //     //     const mockUser: User = {
    //     //         id: 'user-id-1',
    //     //         balance: 100,
    //     //     } as User;

    //     //     const rentCarDto: RentCarDto = {
    //     //         carId: 'car-id-1',
    //     //         hours: 2,
    //     //     };

    //     //     jest.spyOn(carsService, 'findById').mockResolvedValue({
    //     //         id: 'car-id-1',
    //     //         status: 'RENTED', // Simulating an unavailable car
    //     //         pricePerHour: 20,
    //     //     });

    //     //     await expect(service.rentCar(rentCarDto, mockUser)).rejects.toThrow(BadRequestException);
    //     // });

    //     // it('should throw BadRequestException if user balance is insufficient', async () => {
    //     //     const mockUser: User = {
    //     //         id: 'user-id-1',
    //     //         balance: 10, // Insufficient balance for the rental cost
    //     //     } as User;

    //     //     const rentCarDto: RentCarDto = {
    //     //         carId: 'car-id-1',
    //     //         hours: 2,
    //     //     };

    //     //     jest.spyOn(carsService, 'findById').mockResolvedValue({
    //     //         id: 'car-id-1',
    //     //         status: 'AVAILABLE',
    //     //         pricePerHour: 20,
    //     //     });

    //     //     await expect(service.rentCar(rentCarDto, mockUser)).rejects.toThrow(BadRequestException);
    //     // });
    // });
})