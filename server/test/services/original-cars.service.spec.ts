import { Test } from '@nestjs/testing'
import { OriginalCarsService } from '@/services';
import { OriginalCar } from '@/entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';
import { applySearchAndPagination } from '@/helpers';
import { QueryCarsDto, } from '@/dtos';
import { NotFoundException } from '@nestjs/common';
import { repositoryMock, mockOriginalCar } from '../mocks';

jest.mock('@/helpers/utils/applySearchAndPagination', () => ({
    applySearchAndPagination: jest.fn(),
}));

const createCarDtoMock = {
    imageUrl: "image-url",
    model: "Model 1",
    year: 2024,
    description: "Car description",
    pricePerHour: 100,
    type: "Sport",
};

const mockQueryBuilder = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockResolvedValue([]),
};

describe('OriginalCarsService', () => {
    let originalCarsService: OriginalCarsService;
    let originalCarsRepository: Repository<OriginalCar>;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                OriginalCarsService,
                {
                    provide: getRepositoryToken(OriginalCar),
                    useValue: repositoryMock,
                },
            ],
        }).compile();

        originalCarsService = module.get<OriginalCarsService>(OriginalCarsService);
        originalCarsRepository = module.get<Repository<OriginalCar>>(getRepositoryToken(OriginalCar));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(originalCarsService).toBeDefined();
    });

    describe('createOriginalCar', () => {
        it('should create an original car', async () => {
            const createdCar = {
                id: 'car-id',
                ...createCarDtoMock
            } as OriginalCar;


            jest.spyOn(originalCarsRepository, 'create').mockReturnValue(createdCar);
            jest.spyOn(originalCarsRepository, 'save').mockResolvedValue(createdCar);

            const result = await originalCarsService.createOriginalCar(createCarDtoMock);

            expect(result).toBe(createdCar);
            expect(originalCarsRepository.create).toHaveBeenCalledWith(createCarDtoMock);
            expect(originalCarsRepository.save).toHaveBeenCalledWith(createdCar);
        });
    });

    describe('createOriginalCarTransaction', () => {
        it('should create an original car within a transaction', async () => {
            const createdCar = {
                id: 'car-id',
                ...createCarDtoMock
            } as OriginalCar;

            const mockEntityManager = {
                create: jest.fn().mockReturnValue(createdCar),
                save: jest.fn().mockResolvedValue(createdCar),
            };

            const createSpy = jest.spyOn(mockEntityManager, 'create');
            const saveSpy = jest.spyOn(mockEntityManager, 'save');

            const result = await originalCarsService.createOriginalCarTransaction(createCarDtoMock, mockEntityManager as unknown as EntityManager);

            expect(result).toEqual(createdCar);
            expect(createSpy).toHaveBeenCalledWith(OriginalCar, createCarDtoMock);
            expect(saveSpy).toHaveBeenCalledWith(createdCar);
        });

        it('should propagate error when save operation fails', async () => {
            const mockEntityManager = {
                create: jest.fn().mockReturnValue(createCarDtoMock),
                save: jest.fn().mockRejectedValue(new Error('Save failed')),
            };

            await expect(originalCarsService.createOriginalCarTransaction(createCarDtoMock, mockEntityManager as unknown as EntityManager)).rejects.toThrow(Error);

            expect(mockEntityManager.create).toHaveBeenCalledWith(OriginalCar, createCarDtoMock);
            expect(mockEntityManager.save).toHaveBeenCalledWith(createCarDtoMock);
        });
    });

    describe('findById', () => {
        it('should return an original car when found', async () => {
            jest.spyOn(originalCarsRepository, 'findOne').mockResolvedValue(mockOriginalCar);

            const result = await originalCarsService.findById(mockOriginalCar.id);

            expect(result).toEqual(mockOriginalCar);
            expect(originalCarsRepository.findOne).toHaveBeenCalledWith({
                where: { id: mockOriginalCar.id },
            });
        });

        it('should throw NotFoundException when original car is not found', async () => {
            const nonExistingId = 'non-existing-id'

            jest.spyOn(originalCarsRepository, 'findOne').mockResolvedValue(null);

            await expect(originalCarsService.findById(nonExistingId)).rejects.toThrow(NotFoundException);

            expect(originalCarsRepository.findOne).toHaveBeenCalledWith({
                where: { id: nonExistingId },
            });
        });
    });

    describe('findAll', () => {
        it('should return all original cars with pagination and search applied', async () => {
            const listCarsDto: QueryCarsDto = {
                search: 'query',
                page: 1,
                limit: 10,
                order: 'ASC',
                sort: 'model',
            };

            jest.spyOn(originalCarsRepository, 'createQueryBuilder').mockReturnValue(mockQueryBuilder as unknown as SelectQueryBuilder<OriginalCar>);

            (applySearchAndPagination as jest.Mock).mockReturnValue(mockQueryBuilder);

            const result = await originalCarsService.findAll(listCarsDto);

            expect(originalCarsRepository.createQueryBuilder).toHaveBeenCalledWith('original_car');
            expect(applySearchAndPagination).toHaveBeenCalledWith(
                expect.any(Object),
                expect.objectContaining({
                    search: listCarsDto.search,
                    page: listCarsDto.page,
                    limit: listCarsDto.limit,
                    order: listCarsDto.order,
                    sort: listCarsDto.sort,
                    entityAlias: 'original_car',
                }),
            );
            expect(mockQueryBuilder.getMany).toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });
})