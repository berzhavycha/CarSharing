import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { QueryCarsDto } from '@/dtos';
import { OriginalCar } from '@/entities';
import { applySearchAndPagination } from '@/helpers';
import { LoggerService, OriginalCarsService } from '@/services';

import {
  testEntityManager,
  testLoggerService,
  testQueryBuilder,
  testRepository,
} from '../test-objects';
import { makeOriginalCar, makeOriginalCarDto } from '../utils';

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
          useValue: testRepository,
        },
        { provide: LoggerService, useValue: testLoggerService },
      ],
    }).compile();

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

      jest.spyOn(testEntityManager, 'create').mockReturnValue(createdCar);
      jest.spyOn(testEntityManager, 'save').mockResolvedValue(createdCar);

      const result = await originalCarsService.createOriginalCarTransaction(
        dto,
        testEntityManager as unknown as EntityManager,
      );

      expect(result).toEqual(createdCar);
      expect(testEntityManager.save).toHaveBeenCalledWith(createdCar);
    });

    it('should propagate error when save operation fails', async () => {
      const originalCar = makeOriginalCar();
      const dto = makeOriginalCarDto();

      jest.spyOn(testEntityManager, 'create').mockReturnValue(originalCar);
      jest
        .spyOn(testEntityManager, 'save')
        .mockRejectedValue(new Error('Save failed'));

      await expect(
        originalCarsService.createOriginalCarTransaction(
          dto,
          testEntityManager as unknown as EntityManager,
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
      const resultValue = [[originalCar, { ...originalCar, id: '2nd-id' }], 2];

      jest
        .spyOn(originalCarsRepository, 'createQueryBuilder')
        .mockReturnValue(
          testQueryBuilder as unknown as SelectQueryBuilder<OriginalCar>,
        );

      (applySearchAndPagination as jest.Mock).mockReturnValue(testQueryBuilder);

      jest
        .spyOn(testQueryBuilder, 'getManyAndCount')
        .mockResolvedValue(resultValue);

      const result = await originalCarsService.findAll(listCarsDto);

      expect(result).toEqual(resultValue);
    });
  });
});
