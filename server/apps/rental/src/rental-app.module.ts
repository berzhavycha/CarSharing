import { ConsulService } from '@app/shared/discovery/consul.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import {
  CorrelationManagerModule,
  DatabaseModule,
  PulsarConsumerModule,
} from './modules';
import { OutboxModule } from './modules/outbox.module';
import { RentalsModule } from './modules/rentals.module';

@Module({
  imports: [
    RentalsModule,
    ConfigModule,
    DatabaseModule,
    OutboxModule,
    PulsarConsumerModule,
    CorrelationManagerModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [ConsulService],
})
export class RentalAppModule {}
