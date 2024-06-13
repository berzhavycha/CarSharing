import { Module } from '@nestjs/common';

import { CarsModule } from '@modules/cars';
import { ConfigModule } from '@modules/config';
import { DatabaseModule } from '@modules/database';
import { OriginalCarsModule } from '@modules/original-cars';
import { RentalsModule } from '@modules/rentals';
import { TransactionsModule } from '@modules/transactions';
import { UsersModule } from '@modules/users';
import { AuthModule } from '@modules/auth';

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
export class AppModule { }
