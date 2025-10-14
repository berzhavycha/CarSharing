import { ConsulService } from '@app/shared/discovery/consul.service';
import { Module } from '@nestjs/common';
import { PulsarModule } from '@streamware/nestjs-pulsar';

import { CorrelationManagerModule, PulsarConsumerModule } from './modules';
import { CarPhotoModule } from './modules/car-photo.module';
import { CarModule } from './modules/car.module';
import { ConfigModule } from './modules/config.module';
import { DatabaseModule } from './modules/database.module';
import { OriginalCarModule } from './modules/original-car.module';
import { OutboxModule } from './modules/outbox.module';

@Module({
  imports: [
    CorrelationManagerModule,
    PulsarModule,
    ConfigModule,
    DatabaseModule,
    CarModule,
    OriginalCarModule,
    CarPhotoModule,
    PulsarConsumerModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [ConsulService],
})
export class CarAppModule {}
