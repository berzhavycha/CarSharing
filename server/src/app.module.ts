import { Module } from '@nestjs/common';

import {
  AuthModule,
  CarsModule,
  ConfigModule,
  DatabaseModule,
  LocalFilesModule,
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
    LocalFilesModule,
  ],
})
export class AppModule {}
