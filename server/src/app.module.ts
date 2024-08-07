import { MiddlewareConsumer, Module } from '@nestjs/common';

import {
  AuthModule,
  CarsModule,
  ConfigModule,
  DatabaseModule,
  FilesManagerModule,
  LoggerModule,
  OriginalCarsModule,
  PublicFilesModule,
  RentalsModule,
  TransactionsModule,
  UsersModule,
} from '@/modules';

import { RequestLoggingMiddleware } from './middlewares';

@Module({
  imports: [
    LoggerModule,
    DatabaseModule,
    ConfigModule,
    UsersModule,
    CarsModule,
    OriginalCarsModule,
    RentalsModule,
    TransactionsModule,
    AuthModule,
    PublicFilesModule,
    FilesManagerModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
