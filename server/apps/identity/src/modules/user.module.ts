import { AUTH_SERVICE, CorrelationManager } from '@app/shared';
import { FileCommands } from '@app/shared/contracts/file-commands.contracts';
import { UserEvents } from '@app/shared/contracts/user-events.contract';
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
import { PULSAR_CLIENT, PulsarModule } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { UsersController } from '../controllers';
import { Role, User } from '../entities';
import {
  FILE_COMMANDS_PRODUCER,
  USER_EVENTS_PRODUCER,
} from '../helpers/constants/providers';
import { RoleService, UserService } from '../services';

import { CorrelationManagerModule } from './correlation-manager.module';
import { UserAvatarModule } from './user-avatar.module';

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
    UserAvatarModule,
    CorrelationManagerModule,
    PulsarModule,
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: USER_EVENTS_PRODUCER,
      useFactory: (pulsarProducer: Client): EventProducer<UserEvents> => {
        return new EventProducer<UserEvents>(
          pulsarProducer,
          Topics.USER_EVENTS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
    {
      provide: FILE_COMMANDS_PRODUCER,
      useFactory: (pulsarProducer: Client): EventProducer<FileCommands> => {
        return new EventProducer<FileCommands>(
          pulsarProducer,
          Topics.FILE_COMMANDS_CHANNEL_TOPIC,
        );
      },
      inject: [PULSAR_CLIENT],
    },
    UserService,
    RoleService,
    CorrelationManager,
  ],
  exports: [UserService, CorrelationManager],
})
export class UserModule {}
