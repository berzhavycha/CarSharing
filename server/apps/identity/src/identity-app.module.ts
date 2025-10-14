import { ConsulService } from '@app/shared/discovery/consul.service';
import { Module } from '@nestjs/common';

import { AuthModule, ConfigModule, UserModule } from './modules';
import { DatabaseModule } from './modules/database.module';
import { OutboxModule } from './modules/outbox.module';
import { PulsarConsumerModule } from './modules/pulsar-consumer.module';
import { UserAvatarModule } from './modules/user-avatar.module';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    UserModule,
    UserAvatarModule,
    DatabaseModule,
    PulsarConsumerModule,
    OutboxModule,
  ],
  controllers: [],
  providers: [ConsulService],
})
export class IdentityAppModule {}
