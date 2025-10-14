import { ConsulService } from '@app/shared/discovery/consul.service';
import { Module } from '@nestjs/common';

import { ConfigModule } from './modules/config.module';
import { DatabaseModule } from './modules/database.module';
import { PaymentModule } from './modules/payments.module';
import { PulsarConsumerModule } from './modules/pulsar-consumer.module';
import { TransactionsModule } from './modules/transactions.module';

@Module({
  imports: [
    PaymentModule,
    ConfigModule,
    DatabaseModule,
    TransactionsModule,
    PulsarConsumerModule,
  ],
  controllers: [],
  providers: [ConsulService],
})
export class PaymentAppModule {}
