import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository, SelectQueryBuilder } from 'typeorm';

import { Transaction } from '@/entities';
import { TransactionsService } from '@/services';

import { mockEntityManager, mockQueryBuilder, mockTransanction, repositoryMock } from '../mocks';
import { QueryTransactionsDto } from '@/dtos';
import { applySearchAndPagination } from '@/helpers';

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
          useValue: repositoryMock,
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
      jest
        .spyOn(transactionsRepository, 'create')
        .mockReturnValue(mockTransanction);
      jest.spyOn(mockEntityManager, 'save').mockResolvedValue(mockTransanction);

      const result = await transactionsService.createTransaction(
        mockTransanction,
        mockEntityManager as unknown as EntityManager,
      );

      expect(result).toBe(mockTransanction);
      expect(transactionsRepository.create).toHaveBeenCalledWith(
        mockTransanction,
      );
      expect(mockEntityManager.save).toHaveBeenCalledWith(mockTransanction);
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

      jest
        .spyOn(transactionsRepository, 'createQueryBuilder')
        .mockReturnValue(mockQueryBuilder as unknown as SelectQueryBuilder<Transaction>);

      (applySearchAndPagination as jest.Mock).mockReturnValue(mockQueryBuilder as unknown as SelectQueryBuilder<Transaction>);

      jest.spyOn(mockQueryBuilder, 'getManyAndCount').mockResolvedValue([[mockTransanction], 1])

      const result = await transactionsService.findAll(listCarsDto);

      expect(transactionsRepository.createQueryBuilder).toHaveBeenCalledWith('transaction');
      expect(applySearchAndPagination).toHaveBeenCalledWith(
        expect.any(Object),
        expect.objectContaining({
          search: listCarsDto.search,
          page: listCarsDto.page,
          limit: listCarsDto.limit,
          order: listCarsDto.order,
          sort: listCarsDto.sort,
          entityAlias: 'transaction',
        }),
      );
      expect(mockQueryBuilder.getManyAndCount).toHaveBeenCalled();
      expect(result).toEqual([[mockTransanction], 1]);
    });
  });

});
