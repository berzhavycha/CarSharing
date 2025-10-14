import { UserEvents } from '@app/shared/contracts/user-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PULSAR_CLIENT, PulsarModule } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { UserOutboxEntity } from '../entities/user-outbox.entity';
import { USER_EVENTS_PRODUCER } from '../helpers/constants/providers';
import { OutboxPublisherService } from '../services/outbox-publisher.service';

@Module({
  imports: [PulsarModule, TypeOrmModule.forFeature([UserOutboxEntity])],
  controllers: [],
  providers: [
    OutboxPublisherService,
    {
      provide: USER_EVENTS_PRODUCER,
      useFactory: (client: Client) => {
        return new EventProducer<UserEvents>(client);
      },
      inject: [PULSAR_CLIENT],
    },
  ],
})
export class OutboxModule {}
