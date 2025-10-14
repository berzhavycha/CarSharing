import { FileEvents } from '@app/shared/contracts/file-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Module } from '@nestjs/common';
import {
  PULSAR_CLIENT,
  PulsarModule,
  PulsarProducerService,
} from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { FileCommandsConsumer } from '../core/consumers/file-commands.consumer';
import { FILE_EVENTS_PRODUCER } from '../helpers/constants/providers';

import { FileModule } from './file.module';

@Module({
  imports: [PulsarModule, FileModule],
  providers: [
    FileCommandsConsumer,
    {
      provide: FILE_EVENTS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<FileEvents>(pulsarProducer);
      },
      inject: [PULSAR_CLIENT],
    },
  ],
  exports: [],
})
export class PulsarConsumerModule {}
