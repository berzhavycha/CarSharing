import { MiddlewareConsumer, Module } from '@nestjs/common';

import {
  AuthModule,
  CarsModule,
  ConfigModule,
  DatabaseModule,
  FilesManagerModule,
  IdempotencyModule,
  LoggerModule,
  OriginalCarsModule,
  PublicFilesModule,
  RentalsModule,
  TransactionsModule,
  UsersModule,
} from '@/modules';

import { RequestLoggingMiddleware } from './middlewares';
import { OAuthModule } from './modules/oauth.module';

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
    OAuthModule,
    FilesManagerModule,
    IdempotencyModule
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggingMiddleware).forRoutes('*');
  }
}
