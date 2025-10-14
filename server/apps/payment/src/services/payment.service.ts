import { NotificationCommands } from '@app/shared/contracts/notification-commands.contracts';
import { PaymentEvents } from '@app/shared/contracts/payment-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { PaymentsCreateChargeDto } from '../dtos/payments-create-charge.dto';
import {
  NOTIFICATION_COMMAND_PRODUCER,
  PAYMENT_EVENTS_PRODUCER,
} from '../helpers/constants/providers';

@Injectable()
export class PaymentService {
  private readonly stripe = new Stripe(process.env.STRIPE_KEY);

  constructor(
    private readonly configService: ConfigService,
    @Inject(PAYMENT_EVENTS_PRODUCER)
    private readonly paymentEventsProducer: EventProducer<PaymentEvents>,
    @Inject(NOTIFICATION_COMMAND_PRODUCER)
    private readonly notificationCommandProducer: EventProducer<NotificationCommands>,
  ) {}

  async createCharge({
    amount,
    email,
    correlationId,
    replyTo,
  }: PaymentsCreateChargeDto & {
    correlationId: string;
    replyTo: Topics;
  }): Promise<Stripe.Response<Stripe.PaymentIntent>> {
    const replyTopic = replyTo ?? Topics.PAYMENT_EVENTS_CHANNEL_TOPIC;

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: 'pm_card_visa',
        amount: amount * 100,
        confirm: true,
        payment_method_types: ['card'],
        currency: 'usd',
      });

      this.notificationCommandProducer.sendEvent({
        type: 'SEND_EMAIL',
        data: {
          to: email,
          subject: 'Payment Confirmation',
          text: `Your payment of $${amount} was successful!`,
        },
      });

      await this.paymentEventsProducer.sendEvent(
        {
          type: 'PAYMENT_PROCESSED',
          data: {
            paymentId: paymentIntent.id,
            metadata: {
              correlationId,
            },
          },
        },
        replyTopic,
      );

      return paymentIntent;
    } catch (error) {
      console.error('Payment failed:', error.message);

      await this.paymentEventsProducer.sendEvent(
        {
          type: 'PAYMENT_FAILED',
          data: {
            reason: error.message,
            metadata: {
              correlationId,
            },
          },
        },
        replyTopic,
      );

      throw error;
    }
  }
}
