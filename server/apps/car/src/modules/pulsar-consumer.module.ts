import { CarEvents } from '@app/shared/contracts/car-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Module } from '@nestjs/common';
import {
  PULSAR_CLIENT,
  PulsarModule,
  PulsarProducerService,
} from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { CarCommandsConsumer } from '../core/consumers/car-commands.consumer';
import { CAR_EVENTS_PRODUCER } from '../helpers/constants/providers';

import { CarPhotoModule } from './car-photo.module';
import { CarModule } from './car.module';
import { CorrelationManagerModule } from './correlation-manager.module';

@Module({
  imports: [PulsarModule, CarPhotoModule, CarModule, CorrelationManagerModule],
  providers: [
    CarCommandsConsumer,
    {
      provide: CAR_EVENTS_PRODUCER,
      useFactory: (client: Client) => {
        return new EventProducer<CarEvents>(
          client,
          Topics.CAR_EVENTS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
  ],
  exports: [],
})
export class PulsarConsumerModule {}
