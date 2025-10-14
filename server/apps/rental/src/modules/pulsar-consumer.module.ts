import { CarCommands } from '@app/shared/contracts/car-commands.contract';
import { PaymentCommands } from '@app/shared/contracts/payment-commands.contract';
import { RentalCommands } from '@app/shared/contracts/rental-commands.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Module } from '@nestjs/common';
import {
  PULSAR_CLIENT,
  PulsarModule,
  PulsarProducerService,
} from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { RentCarOrchestratorConsumer } from '../core/consumers/rent-car-orchestrator.consumer';
import { RentalCommandsConsumer } from '../core/consumers/rental-command.consumer';
import { ReturnCarOrchestratorConsumer } from '../core/consumers/return-car-orchestrator.consumer';
import {
  CAR_COMMANDS_PRODUCER,
  PAYMENT_COMMANDS_PRODUCER,
  RENTAL_COMMANDS_PRODUCER,
  USER_COMMANDS_PRODUCER,
} from '../helpers/constants/providers';

import { CorrelationManagerModule } from './correlation-manager.module';
import { RentalsModule } from './rentals.module';

@Module({
  imports: [PulsarModule, CorrelationManagerModule, RentalsModule],
  providers: [
    RentalCommandsConsumer,
    RentCarOrchestratorConsumer,
    ReturnCarOrchestratorConsumer,
    {
      provide: CAR_COMMANDS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<CarCommands>(
          pulsarProducer,
          Topics.CAR_COMMANDS_CHANNEL_TOPIC,
        );
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
    {
      provide: USER_COMMANDS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<PaymentCommands>(
          pulsarProducer,
          Topics.USER_COMMANDS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
    {
      provide: RENTAL_COMMANDS_PRODUCER,
      useFactory: (pulsarProducer: Client) => {
        return new EventProducer<RentalCommands>(
          pulsarProducer,
          Topics.RENTAL_COMMANDS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
  ],
  exports: [],
})
export class PulsarConsumerModule {}
