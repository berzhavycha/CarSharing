import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { QueryTransactionsDto } from '@/dtos';
import { PublicFile, Transaction } from '@/entities';
import { applySearchAndPagination } from '@/helpers';
import { TransactionsService } from '@/services';

import { makeTransaction } from '../utils';
import { createMock } from '@golevelup/ts-jest';

jest.mock('../../src/helpers/utils/apply-search-and-pagination.ts', () => ({
  applySearchAndPagination: jest.fn(),
}));

describe('TransanctionsService', () => {
  let transactionsService: TransactionsService;
  let transactionsRepository: Repository<Transaction>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TransactionsService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: createMock<Repository<PublicFile>>(),
        },
      ],
    }).useMocker(createMock)
      .compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
    transactionsRepository = module.get<Repository<Transaction>>(
      getRepositoryToken(Transaction),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transactionsService).toBeDefined();
  });

  describe('createTransaction', () => {
    it('should create a transanction', async () => {
      const transaction = makeTransaction();
      const entityManager = createMock<EntityManager>()

      jest.spyOn(transactionsRepository, 'create').mockReturnValue(transaction);
      jest.spyOn(entityManager, 'save').mockResolvedValue(transaction);

      const result = await transactionsService.createTransaction(
        transaction,
        entityManager,
      );

      expect(result).toBe(transaction);
      expect(entityManager.save).toHaveBeenCalledWith(transaction);
    });
  });

  describe('findAll', () => {
    it('should return transactions and count', async () => {
      const transaction = makeTransaction();
      const paginationResult: [Transaction[], number] = [[transaction, transaction], 2];
      const queryBuilder = createMock<SelectQueryBuilder<Transaction>>()

      jest.spyOn(queryBuilder, 'leftJoinAndSelect').mockReturnThis()
      jest.spyOn(queryBuilder, 'getManyAndCount').mockResolvedValue(paginationResult)
      jest.spyOn(transactionsRepository, 'createQueryBuilder').mockReturnValue(queryBuilder);

      const mockApplySearchAndPagination = applySearchAndPagination as jest.Mock;
      mockApplySearchAndPagination.mockImplementation((qb) => qb);

      const queryDto: QueryTransactionsDto = {};
      const result = await transactionsService.findAll(queryDto);

      expect(result).toEqual(paginationResult);
    });
  });
});
