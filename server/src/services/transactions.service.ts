import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { QueryTransactionsDto } from '@/dtos';
import { Rental, Transaction, User } from '@/entities';
import {
  applySearchAndPagination,
  DEFAULT_ORDER,
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_PAGE,
  TRANSACTION_DEFAULT_SEARCH_COLUMNS,
  TRANSACTION_DEFAULT_SORT_COLUMN,
  TransactionType,
} from '@/helpers';

import { LoggerService } from './logger.service';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
    private readonly loggerService: LoggerService,
  ) {}

  async createTransaction(
    transactionData: {
      amount: number;
      description?: string;
      type: TransactionType;
      user: User;
      rental?: Rental;
    },
    manager: EntityManager,
  ): Promise<Transaction> {
    try {
      const transaction = this.transactionsRepository.create(transactionData);
      return manager.save(transaction);
    } catch (error) {
      this.loggerService.error(
        `Error creating transaction: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(
    listDto: QueryTransactionsDto,
  ): Promise<[Transaction[], number]> {
    try {
      const { search, page, limit, order, sort } = listDto;

      const queryBuilder = this.transactionsRepository
        .createQueryBuilder('transaction')
        .leftJoinAndSelect('transaction.user', 'user')
        .leftJoinAndSelect('transaction.rental', 'rental');

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
      this.loggerService.error(
        `Error finding all transactions: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
