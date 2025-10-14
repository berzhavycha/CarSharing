import { NotificationCommands } from '@app/shared/contracts/notification-commands.contracts';
import { PaymentEvents } from '@app/shared/contracts/payment-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Module } from '@nestjs/common';
import {
  PULSAR_CLIENT,
  PulsarModule,
  PulsarProducerService,
} from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import {
  NOTIFICATION_COMMAND_PRODUCER,
  PAYMENT_EVENTS_PRODUCER,
} from '../helpers/constants/providers';
import { PaymentService } from '../services/payment.service';

@Module({
  imports: [PulsarModule],
  controllers: [],
  providers: [
    PaymentService,
    {
      provide: PAYMENT_EVENTS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<PaymentEvents>(pulsarProducer);
      },
      inject: [PULSAR_CLIENT],
    },
    {
      provide: NOTIFICATION_COMMAND_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<NotificationCommands>(
          pulsarProducer,
          Topics.NOTIFICATION_COMMANDS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
  ],
  exports: [PaymentService],
})
export class PaymentModule {}
