import { Module } from '@nestjs/common';
import { PulsarModule } from '@streamware/nestjs-pulsar';

import { PaymentCommandsConsumer } from '../core/consumers/payment-commands.consumer';

import { PaymentModule } from './payments.module';

@Module({
  imports: [PulsarModule, PaymentModule],
  providers: [PaymentCommandsConsumer],
  exports: [],
})
export class PulsarConsumerModule {}
