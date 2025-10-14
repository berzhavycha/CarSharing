import { CarEvents } from '@app/shared/contracts/car-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PULSAR_CLIENT,
  PulsarModule,
  PulsarProducerService,
} from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { CarOutboxEntity } from '../entities/car-outbox.entity';
import { CAR_EVENTS_PRODUCER } from '../helpers/constants/providers';
import { OutboxPublisherService } from '../services/outbox-publisher.service';

@Module({
  imports: [PulsarModule, TypeOrmModule.forFeature([CarOutboxEntity])],
  controllers: [],
  providers: [
    OutboxPublisherService,
    {
      provide: CAR_EVENTS_PRODUCER,
      useFactory: (client: Client) => {
        return new EventProducer<CarEvents>(client);
      },
      inject: [PULSAR_CLIENT],
    },
  ],
})
export class OutboxModule {}
