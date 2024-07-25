import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsController } from '@/controllers';
import { QueryTransactionsDto } from '@/dtos';
import { Transaction } from '@/entities';
import { TransactionsService } from '@/services';

import { makeTransaction } from '../utils';

describe('TransactionsController', () => {
  let transactionsService: TransactionsService;
  let transactionsController: TransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
    })
      .useMocker(createMock)
      .compile();

    transactionsService = module.get<TransactionsService>(TransactionsService);
    transactionsController = module.get<TransactionsController>(
      TransactionsController,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(transactionsController).toBeDefined();
  });

  describe('findAll', () => {
    it('should return list of transactions', async () => {
      const listDto: QueryTransactionsDto = {
        search: 'query',
        page: 1,
        limit: 10,
        order: 'ASC',
        sort: 'amount',
      };

      const transaction = makeTransaction();
      const transactions: Transaction[] = [
        { ...transaction },
        { ...transaction, id: '2nd-id' },
      ];

      jest
        .spyOn(transactionsService, 'findAll')
        .mockResolvedValue([transactions, transactions.length]);

      const result = await transactionsService.findAll(listDto);

      expect(result).toEqual([transactions, transactions.length]);
    });
  });
});
