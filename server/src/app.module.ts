import { Module } from '@nestjs/common';

import {
  AuthModule,
  CarsModule,
  ConfigModule,
  DatabaseModule,
  OriginalCarsModule,
  RentalsModule,
  TransactionsModule,
  UsersModule,
  PublicFilesModule
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
    PublicFilesModule,
  ],
})
export class AppModule { }
