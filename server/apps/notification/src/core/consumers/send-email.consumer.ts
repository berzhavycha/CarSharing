import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { PULSAR_CLIENT, PulsarConsumer } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { EmailService } from '../../services/email.service';
import { NotificationCommands } from '@app/shared/contracts/notification-commands.contracts';

type EventPayload<E extends keyof NotificationCommands> = {
  type: E;
  data: NotificationCommands[E];
};

@Injectable()
export class SendEmailConsumer extends PulsarConsumer<EventPayload<keyof NotificationCommands>> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    private readonly emailService: EmailService,
  ) {
    super(pulsarClient, {
      topic: Topics.NOTIFICATION_COMMANDS_CHANNEL_TOPIC,
      subscriptionType: 'Shared',
      subscription: 'notification-subscription',
    });
  }

  protected async handleMessage(message: EventPayload<keyof NotificationCommands>): Promise<void> {
    try {
      console.log('Send email payload received:', message);
      await this.emailService.sendMail(message.data);
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
