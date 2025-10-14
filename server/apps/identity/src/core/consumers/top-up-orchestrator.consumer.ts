import { CorrelationManager } from '@app/shared';
import { PaymentCommands } from '@app/shared/contracts/payment-commands.contract';
import { PaymentEvents } from '@app/shared/contracts/payment-events.contract';
import { UserCommands } from '@app/shared/contracts/user-commands.contract';
import { UserEvents } from '@app/shared/contracts/user-events.contract';
import { DedupConsumer } from '@app/shared/services/dedup-consumer.service';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { PULSAR_CLIENT } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import {
  PAYMENT_COMMANDS_PRODUCER,
  USER_COMMANDS_PRODUCER,
} from '../../helpers/constants/providers';
import { UserService } from '../../services';

export type TopUpOrchestratorEvents = UserEvents & PaymentEvents;
export type TopUpOrchestratorCommands = UserCommands & PaymentCommands;
export type EventPayload<E extends keyof TopUpOrchestratorEvents> = {
  type: E;
  data: TopUpOrchestratorEvents[E];
};

@Injectable()
export class TopUpOrchestratorConsumer extends DedupConsumer<
  EventPayload<keyof TopUpOrchestratorEvents>
> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    correlationManager: CorrelationManager,
    @Inject(USER_COMMANDS_PRODUCER)
    private readonly userCommandsProducer: EventProducer<UserCommands>,
    @Inject(PAYMENT_COMMANDS_PRODUCER)
    private readonly paymentCommandsProducer: EventProducer<PaymentCommands>,
    private readonly usersService: UserService,
  ) {
    super(correlationManager, pulsarClient, {
      topic: Topics.TOP_UP_USER_ACCOUNT_CHANNEL_TOPIC,
      subscription: 'top-up-orchestrator-sub',
      subscriptionType: 'KeyShared',
    });
  }

  private isUserBalanceUpdated(
    payload: EventPayload<keyof TopUpOrchestratorEvents>,
  ): payload is EventPayload<'USER_BALANCE_TOPPED_UP'> {
    return payload?.type === 'USER_BALANCE_TOPPED_UP';
  }

  private isUserBalanceTopUpFailed(
    payload: EventPayload<keyof TopUpOrchestratorEvents>,
  ): payload is EventPayload<'USER_BALANCE_TOPUP_FAILED'> {
    return payload?.type === 'USER_BALANCE_TOPUP_FAILED';
  }

  private isPaymentSucceeded(
    payload: EventPayload<keyof TopUpOrchestratorEvents>,
  ): payload is EventPayload<'PAYMENT_PROCESSED'> {
    return payload?.type === 'PAYMENT_PROCESSED';
  }

  private isPaymentFailed(
    payload: EventPayload<keyof TopUpOrchestratorEvents>,
  ): payload is EventPayload<'PAYMENT_FAILED'> {
    return payload?.type === 'PAYMENT_FAILED';
  }

  protected async handleMessage(
    payload: EventPayload<keyof TopUpOrchestratorEvents>,
  ): Promise<void> {
    try {
      const correlationId = payload.data.metadata?.correlationId;
      const eventMessageId = payload.data.metadata?.messageId;
      if (!correlationId) return;

      if (this.isUserBalanceUpdated(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;

          const user = await this.usersService.findById(payload.data.userId);

          await this.paymentCommandsProducer.sendEvent(
            {
              type: 'CREATE_PAYMENT',
              data: {
                email: user.email,
                userId: user.id,
                amount: payload.data.amount,
                metadata: {
                  correlationId,
                  replyTo: Topics.TOP_UP_USER_ACCOUNT_CHANNEL_TOPIC,
                },
              },
            },
            undefined,
            { partitionKey: correlationId },
          );
        });
        return;
      }

      if (this.isPaymentSucceeded(payload)) {
        await this.runOnce(eventMessageId, async () => {
          await this.correlationManager.markRequestAsCompleted(correlationId);
        });
        return;
      }

      if (
        this.isUserBalanceTopUpFailed(payload) ||
        this.isPaymentFailed(payload)
      ) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;

          const topUpPayload =
            pending.payload as UserCommands['TOP_UP_USER_BALANCE'];
          if (topUpPayload.amount) {
            await this.userCommandsProducer.sendEvent(
              {
                type: 'DEDUCT_USER_BALANCE',
                data: {
                  userId: pending.entityId,
                  amount: topUpPayload.amount,
                  metadata: { correlationId },
                },
              },
              Topics.USER_COMMANDS_CHANNEL_TOPIC,
              { partitionKey: correlationId },
            );
          }

          await this.correlationManager.markRequestAsFailed(
            correlationId,
            payload.data.reason ?? 'Top-up saga failed',
          );
        });
        return;
      }

      this.logger.warn(`Unhandled event type: ${payload.type}`);
    } catch (err) {
      this.logger.error(
        `Error processing top-up event: ${(err as Error).message}`,
        (err as Error).stack,
      );
      const corrId = payload.data.metadata?.correlationId;
      if (corrId)
        await this.correlationManager.markRequestAsFailed(
          corrId,
          (err as Error).message,
        );
    }
  }
}
