import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Transaction } from '@/entities';
import { TransactionsService } from '@/services';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
