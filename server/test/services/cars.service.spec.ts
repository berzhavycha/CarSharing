import { Test } from '@nestjs/testing'
import { CarsService } from '@/services';
import { Car } from '@/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { CarStatus, RentalStatus, applySearchAndPagination, carErrorMessages } from '@/helpers';
import { QueryCarsDto, UpdateCarDto } from '@/dtos';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { mockCar, repositoryMock } from '../mocks';

jest.mock('@/helpers/utils/applySearchAndPagination', () => ({
    applySearchAndPagination: jest.fn(),
}));

const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
};

describe('CarsService', () => {
    let carsService: CarsService;
    let carsRepository: Repository<Car>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                CarsService,
                {
                    provide: getRepositoryToken(Car),
                    useValue: repositoryMock,
                },
            ],
        }).compile();

        carsService = module.get<CarsService>(CarsService);
        carsRepository = module.get<Repository<Car>>(getRepositoryToken(Car));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(carsService).toBeDefined();
    });

    describe('createCar', () => {
        it('should create a car', async () => {
            const createCarDtoMock = {
                imageUrl: "image-url",
                model: "Model 1",
                year: 2024,
                description: "Car description",
                pricePerHour: 100,
                type: "Sport",
                status: CarStatus.AVAILABLE
            }

            const createdCar = {
                id: 'car-id',
                ...createCarDtoMock
            } as Car;


            jest.spyOn(carsRepository, 'create').mockReturnValue(createdCar);
            jest.spyOn(carsRepository, 'save').mockResolvedValue(createdCar);

            const result = await carsService.createCar(createCarDtoMock);

            expect(result).toBe(createdCar);
            expect(carsRepository.create).toHaveBeenCalledWith(createCarDtoMock);
            expect(carsRepository.save).toHaveBeenCalledWith(createdCar);
        });
    });

    describe('updateCar', () => {
        it('should update a car', async () => {
            const updateCarDtoMock = {
                imageUrl: "new-image-url",
                model: "Updated Model",
                year: 2025,
                description: "Updated Car description",
                pricePerHour: 120,
                type: "SUV",
                status: CarStatus.BOOKED
            };


            const updatedCar = {
                ...mockCar,
                ...updateCarDtoMock
            } as Car;

            jest.spyOn(carsService, 'findById').mockResolvedValue(mockCar);
            jest.spyOn(carsRepository, 'save').mockResolvedValue(updatedCar);

            const result = await carsService.updateCar(mockCar.id, updateCarDtoMock);

            expect(result).toEqual(updatedCar);
            expect(carsService.findById).toHaveBeenCalledWith(mockCar.id);
            expect(carsRepository.save).toHaveBeenCalledWith(updatedCar);
        });

        it('should throw NotFoundException if car with given id is not found', async () => {
            const nonExistingId = 'non-existing-id'

            jest.spyOn(carsService, 'findById').mockImplementationOnce(() => Promise.reject(new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(nonExistingId))));

            await expect(carsService.updateCar(nonExistingId, {} as UpdateCarDto))
                .rejects.toThrow(NotFoundException);

            expect(carsService.findById).toHaveBeenCalledWith(nonExistingId);
            expect(carsRepository.save).not.toHaveBeenCalled();
        });
    });

    describe('removeCar', () => {
        it('should remove a car when no active rentals exist', async () => {
            jest.spyOn(carsService, 'findById').mockResolvedValue(mockCar);
            jest.spyOn(carsRepository, 'remove').mockResolvedValue(undefined);

            await carsService.removeCar('car-id');

            expect(carsService.findById).toHaveBeenCalledWith('car-id');
            expect(carsRepository.remove).toHaveBeenCalledWith(mockCar);
        });

        it('should throw BadRequestException when active rentals exist', async () => {
            const carWithActiveRental = {
                ...mockCar,
                rentals: [{ status: RentalStatus.ACTIVE }]
            } as Car;

            jest.spyOn(carsService, 'findById').mockResolvedValue(carWithActiveRental);

            jest.spyOn(carsRepository, 'remove').mockResolvedValue(undefined);

            await expect(carsService.removeCar(mockCar.id)).rejects.toThrow(BadRequestException);

            expect(carsService.findById).toHaveBeenCalledWith(mockCar.id);
            expect(carsRepository.remove).not.toHaveBeenCalled();
        });

        it('should throw NotFoundException when car is not found', async () => {
            const nonExistingId = 'non-existing-id'

            jest.spyOn(carsService, 'findById').mockImplementationOnce(() => Promise.reject(new NotFoundException(carErrorMessages.CAR_BY_ID_NOT_FOUND(nonExistingId))));

            await expect(carsService.removeCar(nonExistingId)).rejects.toThrow(NotFoundException);

            expect(carsService.findById).toHaveBeenCalledWith(nonExistingId);
            expect(carsRepository.remove).not.toHaveBeenCalled();
        });
    });

    describe('findById', () => {
        it('should return a car when found', async () => {
            jest.spyOn(carsRepository, 'findOne').mockResolvedValue(mockCar);

            const result = await carsService.findById(mockCar.id);

            expect(result).toEqual(mockCar);
            expect(carsRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockCar.id },
                relations: ['rentals'],
            });
        });

        it('should throw NotFoundException when car is not found', async () => {
            const nonExistingId = 'non-existing-id'

            jest.spyOn(carsRepository, 'findOne').mockResolvedValue(null);

            await expect(carsService.findById(nonExistingId)).rejects.toThrow(NotFoundException);

            expect(carsRepository.findOne).toHaveBeenCalledWith({
                where: { id: nonExistingId },
                relations: ['rentals'],
            });
        });
    });

    describe('findAll', () => {
        it('should return all cars with pagination and search applied', async () => {
            const listCarsDto: QueryCarsDto = {
                search: 'query',
                page: 1,
                limit: 10,
                order: 'ASC',
                sort: 'model',
            };

            jest.spyOn(carsRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as unknown as SelectQueryBuilder<Car>);

            (applySearchAndPagination as jest.Mock).mockReturnValue(mockQueryBuilder);

            const result = await carsService.findAll(listCarsDto);

            expect(carsRepository.createQueryBuilder).toHaveBeenCalledWith('car');
            expect(applySearchAndPagination).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    search: listCarsDto.search,
                    page: listCarsDto.page,
                    limit: listCarsDto.limit,
                    order: listCarsDto.order,
                    sort: listCarsDto.sort,
                    entityAlias: 'car',
                }),
            );
            expect(mockQueryBuilder.getMany).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('findAllAvailable', () => {
        it('should return all available cars with pagination and search applied', async () => {
            const listCarsDto: QueryCarsDto = {
                search: 'query',
                page: 1,
                limit: 10,
                order: 'ASC',
                sort: 'model',
            };

            jest.spyOn(carsRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as unknown as SelectQueryBuilder<Car>);

            (applySearchAndPagination as jest.Mock).mockReturnValue(mockQueryBuilder);

            const result = await carsService.findAllAvailable(listCarsDto);

            expect(carsRepository.createQueryBuilder).toHaveBeenCalledWith('car');
            expect(mockQueryBuilder.where).toHaveBeenCalledWith('car.status = :status', {
                status: CarStatus.AVAILABLE,
            });
            expect(applySearchAndPagination).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    search: listCarsDto.search,
                    page: listCarsDto.page,
                    limit: listCarsDto.limit,
                    order: listCarsDto.order,
                    sort: listCarsDto.sort,
                    entityAlias: 'car',
                }),
            );
            expect(mockQueryBuilder.getMany).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
})