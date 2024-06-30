import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { TransactionsController } from '@/controllers';
import { QueryTransactionsDto } from '@/dtos';
import { Transaction } from '@/entities';
import { TransactionsService } from '@/services';

import { mockTransanction, mockTransanctionService } from '../mocks';

jest.mock('@nestjs/config');
const mockConfigService = {
    get: jest.fn(),
};

describe('TransactionsController', () => {
    let transactionsService: TransactionsService;
    let transactionsController: TransactionsController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [TransactionsController],
            providers: [
                {
                    provide: TransactionsService,
                    useValue: mockTransanctionService,
                },
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        transactionsService = module.get<TransactionsService>(TransactionsService);
        transactionsController = module.get<TransactionsController>(TransactionsController);
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
            const transactions: Transaction[] = [{ ...mockTransanction }, { ...mockTransanction, id: '2nd-id' }];

            jest.spyOn(transactionsService, 'findAll').mockResolvedValue([transactions, transactions.length]);

            const result = await transactionsService.findAll(listDto);

            expect(result).toEqual([transactions, transactions.length]);
            expect(transactionsService.findAll).toHaveBeenCalledWith(listDto);
        });
    });
});