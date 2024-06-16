import { Rental, Transaction, User } from "@/entities";
import { TransactionType } from "@/helpers";
import { Injectable } from "@nestjs/common";
import { InjectEntityManager, InjectRepository } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { UsersService } from "./users.service";

@Injectable()
export class TransactionsService {
    constructor(
        @InjectRepository(Transaction)
        private readonly transactionsRepository: Repository<Transaction>,
        private readonly usersService: UsersService,
        @InjectEntityManager() private entityManager: EntityManager,
    ) { }

    async createTransaction(transactionData: {
        amount: number,
        description?: string,
        type: TransactionType,
        user: User,
        rental: Rental
    }): Promise<Transaction> {
        return this.entityManager.transaction(async manager => {
            transactionData.user.balance += transactionData.amount;
            await manager.save(transactionData.user);

            const transaction = this.transactionsRepository.create(transactionData);

            return manager.save(transaction);
        });
    }

}
