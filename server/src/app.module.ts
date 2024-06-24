import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

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
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'uploads'),
    }),
  ],
})
export class AppModule {}
