import { PaymentCommands } from '@app/shared/contracts/payment-commands.contract';
import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { PULSAR_CLIENT, PulsarConsumer } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { PaymentService } from '../../services/payment.service';

type EventPayload<E extends keyof PaymentCommands> = {
  type: E;
  data: PaymentCommands[E];
};

const isCreatePayment = (
  payload: EventPayload<keyof PaymentCommands>,
): payload is EventPayload<'CREATE_PAYMENT'> => {
  return payload.type === 'CREATE_PAYMENT';
};

@Injectable()
export class PaymentCommandsConsumer extends PulsarConsumer<
  EventPayload<keyof PaymentCommands>
> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    private readonly paymentService: PaymentService,
  ) {
    super(pulsarClient, {
      topic: Topics.PAYMENT_COMMANDS_CHANNEL_TOPIC,
      subscriptionType: 'KeyShared',
      subscription: 'payment-subscription',
    });
  }

  protected async handleMessage(
    payload: EventPayload<keyof PaymentCommands>,
  ): Promise<void> {
    try {
      if (isCreatePayment(payload)) {
        const { data } = payload;
        console.log('Charge payload received:', payload);
        await this.paymentService.createCharge({
          amount: data.amount,
          correlationId: data.metadata.correlationId,
          replyTo: data.metadata.replyTo,
          email: data.email,
        });
      }
    } catch (error) {
      console.log(error);
      throw error
    }
  }
}
