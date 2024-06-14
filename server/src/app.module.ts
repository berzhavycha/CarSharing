import { Module } from '@nestjs/common';

import { ConfigModule, DatabaseModule } from '@/core';
import {
  AuthModule,
  CarsModule,
  OriginalCarsModule,
  RentalsModule,
  TransactionsModule,
  UsersModule,
} from '@/modules';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    UsersModule,
    CarsModule,
    OriginalCarsModule,
    RentalsModule,
    TransactionsModule,
    AuthModule,
  ],
})
export class AppModule {}
