import { ConfigModule, DatabaseModule } from '@core';
import {
  AuthModule,
  CarsModule,
  OriginalCarsModule,
  RentalsModule,
  TransactionsModule,
  UsersModule,
} from '@modules';
import { Module } from '@nestjs/common';

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
