import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { QueryCarsDto } from '@/dtos';
import { OriginalCar } from '@/entities';
import { applySearchAndPagination } from '@/helpers';
import { OriginalCarsService } from '@/services';

import { makeOriginalCar, makeOriginalCarDto } from '../utils';
import { createMock } from '@golevelup/ts-jest';

jest.mock('../../src/helpers/utils/apply-search-and-pagination.ts', () => ({
  applySearchAndPagination: jest.fn(),
}));

describe('OriginalCarsService', () => {
  let originalCarsService: OriginalCarsService;
  let originalCarsRepository: Repository<OriginalCar>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        OriginalCarsService,
        {
          provide: getRepositoryToken(OriginalCar),
          useValue: createMock<Repository<OriginalCar>>(),
        },
      ],
    }).useMocker(createMock)
      .compile();

    originalCarsService = module.get<OriginalCarsService>(OriginalCarsService);
    originalCarsRepository = module.get<Repository<OriginalCar>>(
      getRepositoryToken(OriginalCar),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(originalCarsService).toBeDefined();
  });

  describe('createOriginalCar', () => {
    it('should create an original car', async () => {
      const createdCar = makeOriginalCar();
      const dto = makeOriginalCarDto();

      jest.spyOn(originalCarsRepository, 'create').mockReturnValue(createdCar);
      jest.spyOn(originalCarsRepository, 'save').mockResolvedValue(createdCar);

      const result = await originalCarsService.createOriginalCar(dto);

      expect(result).toBe(createdCar);
      expect(originalCarsRepository.save).toHaveBeenCalledWith(createdCar);
    });
  });

  describe('createOriginalCarTransaction', () => {
    it('should create an original car within a transaction', async () => {
      const createdCar = makeOriginalCar();
      const dto = makeOriginalCarDto();

      const entityManager = createMock<EntityManager>();
      jest.spyOn(entityManager, 'create').mockReturnValue(createdCar as unknown as unknown[]);
      jest.spyOn(entityManager, 'save').mockResolvedValue(createdCar);

      const result = await originalCarsService.createOriginalCarTransaction(
        dto,
        entityManager
      );

      expect(result).toEqual(createdCar);
      expect(entityManager.save).toHaveBeenCalledWith(createdCar);
    });

    it('should propagate error when save operation fails', async () => {
      const originalCar = makeOriginalCar();
      const dto = makeOriginalCarDto();

      const entityManager = createMock<EntityManager>()
      jest.spyOn(entityManager, 'create').mockReturnValue(originalCar as unknown as unknown[]);
      jest
        .spyOn(entityManager, 'save')
        .mockRejectedValue(new Error('Save failed'));

      await expect(
        originalCarsService.createOriginalCarTransaction(
          dto,
          entityManager,
        ),
      ).rejects.toThrow(Error);
    });
  });

  describe('findById', () => {
    const originalCar = makeOriginalCar();

    it('should return an original car when found', async () => {
      jest
        .spyOn(originalCarsRepository, 'findOne')
        .mockResolvedValue(originalCar);

      const result = await originalCarsService.findById(originalCar.id);

      expect(result).toEqual(originalCar);
    });

    it('should throw NotFoundException when original car is not found', async () => {
      const nonExistingId = 'non-existing-id';

      jest.spyOn(originalCarsRepository, 'findOne').mockResolvedValue(null);

      await expect(originalCarsService.findById(nonExistingId)).rejects.toThrow(
        NotFoundException,
      );
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

      const originalCar = makeOriginalCar();
      const resultValue: [OriginalCar[], number] = [[originalCar, { ...originalCar, id: '2nd-id' }], 2];
      const queryBuilder = createMock<SelectQueryBuilder<OriginalCar>>()

      jest
        .spyOn(originalCarsRepository, 'createQueryBuilder')
        .mockReturnValue(queryBuilder);

      (applySearchAndPagination as jest.Mock).mockReturnValue(queryBuilder);

      jest
        .spyOn(queryBuilder, 'getManyAndCount')
        .mockResolvedValue(resultValue);

      const result = await originalCarsService.findAll(listCarsDto);

      expect(result).toEqual(resultValue);
    });
  });
});
