import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { QueryTransactionsDto } from '@/dtos';
import { Transaction } from '@/entities';
import { applySearchAndPagination } from '@/helpers';
import { TransactionsService } from '@/services';

import {
  testEntityManager,
  testQueryBuilder,
  testRepository,
} from '../test-objects';
import { makeTransaction } from '../utils';

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
          useValue: testRepository,
        },
      ],
    }).compile();

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

      jest.spyOn(transactionsRepository, 'create').mockReturnValue(transaction);
      jest.spyOn(testEntityManager, 'save').mockResolvedValue(transaction);

      const result = await transactionsService.createTransaction(
        transaction,
        testEntityManager as unknown as EntityManager,
      );

      expect(result).toBe(transaction);
      expect(testEntityManager.save).toHaveBeenCalledWith(transaction);
    });
  });

  describe('findAll', () => {
    it('should return all transactions with pagination and search applied', async () => {
      const listCarsDto: QueryTransactionsDto = {
        search: 'query',
        page: 1,
        limit: 10,
        order: 'ASC',
        sort: 'amount',
      };

      const transaction = makeTransaction();

      jest
        .spyOn(transactionsRepository, 'createQueryBuilder')
        .mockReturnValue(
          testQueryBuilder as unknown as SelectQueryBuilder<Transaction>,
        );

      (applySearchAndPagination as jest.Mock).mockReturnValue(
        testQueryBuilder as unknown as SelectQueryBuilder<Transaction>,
      );

      const paginationResult = [[transaction, transaction], 2];

      jest
        .spyOn(testQueryBuilder, 'getManyAndCount')
        .mockResolvedValue(paginationResult);

      const result = await transactionsService.findAll(listCarsDto);

      expect(result).toEqual(paginationResult);
    });
  });
});
