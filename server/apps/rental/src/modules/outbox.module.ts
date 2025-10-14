import { RentalEvents } from '@app/shared/contracts/rental-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PULSAR_CLIENT,
  PulsarModule,
  PulsarProducerService,
} from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { RentalOutboxEntity } from '../entities/rental-outbox.entity';
import { RENTAL_EVENTS_PRODUCER } from '../helpers/constants/providers';
import { OutboxPublisherService } from '../services/outbox-publisher.service';

@Module({
  imports: [PulsarModule, TypeOrmModule.forFeature([RentalOutboxEntity])],
  controllers: [],
  providers: [
    OutboxPublisherService,
    {
      provide: RENTAL_EVENTS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<RentalEvents>(pulsarProducer);
      },
      inject: [PULSAR_CLIENT],
    },
  ],
})
export class OutboxModule {}
