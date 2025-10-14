import { AUTH_SERVICE } from '@app/shared';
import { CarEvents } from '@app/shared/contracts/car-events.contract';
import { FileCommands } from '@app/shared/contracts/file-commands.contracts';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  ClientProvider,
  ClientsModule,
  Transport,
} from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  PULSAR_CLIENT,
  PulsarModule,
} from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { CarController } from '../controllers';
import { Car } from '../entities';
import {
  CAR_EVENTS_PRODUCER,
  FILE_COMMANDS_PRODUCER,
} from '../helpers/constants/providers';
import { CarService } from '../services/car.service';

import { CarPhotoModule } from './car-photo.module';
import { CorrelationManagerModule } from './correlation-manager.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (
          configService: ConfigService,
        ): ClientProvider | Promise<ClientProvider> => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST') || '0.0.0.0',
            port: configService.get('AUTH_PORT') || 4001,
          },
        }),
        inject: [ConfigService],
      },
    ]),
    PulsarModule,
    CarPhotoModule,
    TypeOrmModule.forFeature([Car]),
    CorrelationManagerModule,
  ],
  controllers: [CarController],
  providers: [
    CarService,
    {
      provide: FILE_COMMANDS_PRODUCER,
      useFactory: (client: Client): EventProducer<FileCommands> => {
        return new EventProducer<FileCommands>(
          client,
          Topics.FILE_COMMANDS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
    {
      provide: CAR_EVENTS_PRODUCER,
      useFactory: (client: Client): EventProducer<CarEvents> => {
        return new EventProducer<CarEvents>(
          client,
          Topics.CAR_EVENTS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
  ],
  exports: [CarService],
})
export class CarModule {}
