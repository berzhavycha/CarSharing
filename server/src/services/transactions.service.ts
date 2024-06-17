import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';

import { Rental, Transaction, User } from '@/entities';
import { TransactionType } from '@/helpers';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionsRepository: Repository<Transaction>,
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
    const transaction = this.transactionsRepository.create(transactionData);
    return manager.save(transaction);
  }
}
