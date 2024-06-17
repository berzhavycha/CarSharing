import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Rental } from '@/entities';
import { RentalsService } from '@/services';
import { RentalsController } from '@/controllers';
import { TransactionsModule } from './transactions.module';
import { CarsModule } from './cars.module';
import { OriginalCarsModule } from './original-cars.module';

@Module({
  imports: [TransactionsModule, CarsModule, OriginalCarsModule, TypeOrmModule.forFeature([Rental])],
  controllers: [RentalsController],
  providers: [RentalsService]
})
export class RentalsModule { }
