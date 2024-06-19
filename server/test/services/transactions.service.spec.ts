import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Transaction } from '@/entities';
import { TransactionsService } from '@/services';

import { mockEntityManager, mockTransanction, repositoryMock } from '../mocks';

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
});
