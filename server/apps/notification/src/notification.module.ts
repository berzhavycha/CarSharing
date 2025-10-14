import { Module } from '@nestjs/common';

import { ConfigModule } from './modules/config.module';
import { EmailModule } from './modules/email.module';
import { PulsarConsumerModule } from './modules/pulsar-consumer.module';

@Module({
  imports: [PulsarConsumerModule, ConfigModule, EmailModule],
  controllers: [],
  providers: [],
})
export class NotificationModule {}
