import { Module } from '@nestjs/common';
import { PulsarModule } from '@streamware/nestjs-pulsar';

import { SendEmailConsumer } from '../core/consumers/send-email.consumer';

import { EmailModule } from './email.module';

@Module({
  imports: [PulsarModule, EmailModule],
  providers: [SendEmailConsumer],
  exports: [],
})
export class PulsarConsumerModule {}
