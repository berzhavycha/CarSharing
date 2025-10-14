import { AUTH_SERVICE } from '@app/shared';
import { RentalEvents } from '@app/shared/contracts/rental-events.contract';
import { ConsulService } from '@app/shared/discovery/consul.service';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PULSAR_CLIENT, PulsarModule } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { RentalsController } from '../controllers/rentals.controller';
import { RentalOutboxEntity } from '../entities/rental-outbox.entity';
import { Rental } from '../entities/rental.entity';
import { RENTAL_EVENTS_PRODUCER } from '../helpers/constants/providers';
import { RentalAggregatorService } from '../services/rental-aggregator.service';
import { RentalsService } from '../services/rentals.service';

import { OutboxModule } from './outbox.module';

@Module({
  imports: [
    ConfigModule,
    PulsarModule,
    HttpModule,
    OutboxModule,
    TypeOrmModule.forFeature([Rental, RentalOutboxEntity]),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        imports: [ConfigModule],
        useFactory: (configService: ConfigService): ClientProvider => ({
          transport: Transport.TCP,
          options: {
            host: configService.get<string>('AUTH_HOST') || '0.0.0.0',
            port: configService.get<number>('AUTH_PORT') || 4001,
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RentalsController],
  providers: [
    {
      provide: RENTAL_EVENTS_PRODUCER,
      useFactory: (client: Client) => {
        return new EventProducer<RentalEvents>(
          client,
          Topics.RENTAL_EVENTS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
    RentalsService,
    RentalAggregatorService,
    ConsulService,
  ],
  exports: [RentalsService],
})
export class RentalsModule {}
