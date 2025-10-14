import { PaymentCommands } from '@app/shared/contracts/payment-commands.contract';
import { UserCommands } from '@app/shared/contracts/user-commands.contract';
import { UserEvents } from '@app/shared/contracts/user-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Module } from '@nestjs/common';
import {
  PULSAR_CLIENT,
  PulsarModule,
  PulsarProducerService,
} from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { TopUpOrchestratorConsumer } from '../core/consumers/top-up-orchestrator.consumer';
import { UserCommandsConsumer } from '../core/consumers/user-commands.consumer';
import {
  PAYMENT_COMMANDS_PRODUCER,
  USER_COMMANDS_PRODUCER,
  USER_EVENTS_PRODUCER,
} from '../helpers/constants/providers';

import { CorrelationManagerModule } from './correlation-manager.module';
import { UserAvatarModule } from './user-avatar.module';
import { UserModule } from './user.module';

@Module({
  imports: [
    PulsarModule,
    UserAvatarModule,
    UserModule,
    CorrelationManagerModule,
  ],
  providers: [
    UserCommandsConsumer,
    TopUpOrchestratorConsumer,
    {
      provide: USER_EVENTS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<UserEvents>(pulsarProducer);
      },
      inject: [PULSAR_CLIENT],
    },
    {
      provide: USER_COMMANDS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<UserCommands>(pulsarProducer);
      },
      inject: [PULSAR_CLIENT],
    },
    {
      provide: PAYMENT_COMMANDS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<PaymentCommands>(
          pulsarProducer,
          Topics.PAYMENT_COMMANDS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
  ],
  exports: [],
})
export class PulsarConsumerModule {}
