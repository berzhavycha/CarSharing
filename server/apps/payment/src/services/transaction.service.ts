import {
  applySearchAndPagination,
  DEFAULT_ORDER,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
} from '@app/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryTransactionsDto } from 'apps/server/src/dtos';
import { EntityManager, Repository } from 'typeorm';

import { Transaction } from '../entity/transaction.entity';
import {
  TRANSACTION_DEFAULT_SEARCH_COLUMNS,
  TRANSACTION_DEFAULT_SORT_COLUMN,
  TransactionType,
} from '../helpers';

// import { LoggerService } from './logger.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    // private readonly loggerService: LoggerService,
  ) {}

  async createTransaction(
    transactionData: {
      amount: number;
      description?: string;
      type: TransactionType;
    },
    manager: EntityManager,
  ): Promise<Transaction> {
    try {
      const transaction = this.transactionsRepository.create(transactionData);
      return manager.save(transaction);
    } catch (error) {
      //   this.loggerService.error(
      //     `Error creating transaction: ${error.message}`,
      //     error.stack,
      //   );
      //   throw error;
    }
  }

  async findAll(
    listDto: QueryTransactionsDto,
  ): Promise<[Transaction[], number]> {
    try {
      const { search, page, limit, order, sort } = listDto;

      const queryBuilder =
        this.transactionsRepository.createQueryBuilder('transaction');

      applySearchAndPagination(queryBuilder, {
        search,
        searchColumns: TRANSACTION_DEFAULT_SEARCH_COLUMNS,
        page: page || DEFAULT_PAGINATION_PAGE,
        limit: limit || DEFAULT_PAGINATION_LIMIT,
        order: order || DEFAULT_ORDER,
        sort: sort || TRANSACTION_DEFAULT_SORT_COLUMN,
        entityAlias: 'transaction',
      });

      return queryBuilder.getManyAndCount();
    } catch (error) {
      //   this.loggerService.error(
      //     `Error finding all transactions: ${error.message}`,
      //     error.stack,
      //   );
      //   throw error;
    }
  }

  async findByUser(
    userId: string,
    query: QueryTransactionsDto,
  ): Promise<[Transaction[], number]> {
    const { page, order, limit, sort } = query;

    const qb = this.transactionsRepository.createQueryBuilder('transaction');
    qb.andWhere('transaction.userId = :userId', { userId });

    applySearchAndPagination(qb, {
      searchColumns: TRANSACTION_DEFAULT_SEARCH_COLUMNS,
      page: page || DEFAULT_PAGINATION_PAGE,
      limit: limit || DEFAULT_PAGINATION_LIMIT,
      order: order || DEFAULT_ORDER,
      sort: sort || TRANSACTION_DEFAULT_SORT_COLUMN,
      entityAlias: 'transaction',
    });

    return qb.getManyAndCount();
  }

  async findByRental(
    rentalId: string,
    query: QueryTransactionsDto,
  ): Promise<[Transaction[], number]> {
    const { page, order, limit, sort } = query;
    const qb = this.transactionsRepository.createQueryBuilder('transaction');
    qb.andWhere('transaction.rentalId = :rentalId', { rentalId });

    applySearchAndPagination(qb, {
      searchColumns: TRANSACTION_DEFAULT_SEARCH_COLUMNS,
      page: page || DEFAULT_PAGINATION_PAGE,
      limit: limit || DEFAULT_PAGINATION_LIMIT,
      order: order || DEFAULT_ORDER,
      sort: sort || TRANSACTION_DEFAULT_SORT_COLUMN,
      entityAlias: 'transaction',
    });

    return qb.getManyAndCount();
  }
}
