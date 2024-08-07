import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RentalsController } from '@/controllers';
import { Rental } from '@/entities';
import { RentalsService } from '@/services';

import { CarsModule } from './cars.module';
import { OriginalCarsModule } from './original-cars.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    UsersModule,
    CarsModule,
    OriginalCarsModule,
    TypeOrmModule.forFeature([Rental]),
  ],
  controllers: [RentalsController],
  providers: [RentalsService],
})
export class RentalsModule {}
