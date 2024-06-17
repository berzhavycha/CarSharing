import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rental } from '@/entities';
import { RentalsService } from '@/services';
import { RentalsController } from '@/controllers';
import { TransactionsModule } from './transactions.module';

@Module({
  imports: [TransactionsModule, TypeOrmModule.forFeature([Rental])],
  controllers: [RentalsController],
  providers: [RentalsService]
})
export class RentalsModule { }
