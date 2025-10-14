import { Module } from '@nestjs/common';
import { PulsarModule } from '@streamware/nestjs-pulsar';

import { ConfigModule } from './modules/config.module';
import { DatabaseModule } from './modules/database.module';
import { FileModule } from './modules/file.module';
import { FilesManagerModule } from './modules/files-manager.module';
import { PulsarConsumerModule } from './modules/pulsar-consumer.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule,
    PulsarModule,
    FileModule,
    FilesManagerModule,
    PulsarConsumerModule,
  ],
  controllers: [],
  providers: [],
})
export class FileAppModule {}
