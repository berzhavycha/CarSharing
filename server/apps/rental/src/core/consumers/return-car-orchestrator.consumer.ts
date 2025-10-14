import { CorrelationManager } from '@app/shared';
import { CarCommands } from '@app/shared/contracts/car-commands.contract';
import { CarEvents } from '@app/shared/contracts/car-events.contract';
import { PaymentCommands } from '@app/shared/contracts/payment-commands.contract';
import { PaymentEvents } from '@app/shared/contracts/payment-events.contract';
import { RentalCommands } from '@app/shared/contracts/rental-commands.contract';
import { RentalEvents } from '@app/shared/contracts/rental-events.contract';
import { UserCommands } from '@app/shared/contracts/user-commands.contract';
import { UserEvents } from '@app/shared/contracts/user-events.contract';
import { DedupConsumer } from '@app/shared/services/dedup-consumer.service';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { PULSAR_CLIENT } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import {
  CAR_COMMANDS_PRODUCER,
  RENTAL_COMMANDS_PRODUCER,
  USER_COMMANDS_PRODUCER,
} from '../../helpers/constants/providers';
import { RentalsService } from '../../services/rentals.service';

export type OrchestratorEvents = RentalCommands &
  RentalEvents &
  CarEvents &
  PaymentEvents &
  UserEvents;
export type OrchestratorCommands = RentalCommands &
  CarCommands &
  PaymentCommands &
  UserCommands;
export type EventPayload<E extends keyof OrchestratorEvents> = {
  type: E;
  data: OrchestratorEvents[E];
};

@Injectable()
export class ReturnCarOrchestratorConsumer extends DedupConsumer<
  EventPayload<keyof OrchestratorEvents>
> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    correlationManager: CorrelationManager,
    @Inject(CAR_COMMANDS_PRODUCER)
    private readonly carCommandsProducer: EventProducer<CarCommands>,
    @Inject(RENTAL_COMMANDS_PRODUCER)
    private readonly rentalCommandsProducer: EventProducer<RentalCommands>,
    @Inject(USER_COMMANDS_PRODUCER)
    private readonly userCommandsProducer: EventProducer<UserCommands>,
    private readonly rentalsService: RentalsService,
  ) {
    super(correlationManager, pulsarClient, {
      topic: Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
      subscription: 'return-car-saga-orchestrator-sub',
      subscriptionType: 'KeyShared',
    });
  }

  private isReturnRequested(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'RETURN_CAR'> {
    return payload?.type === 'RETURN_CAR';
  }
  private isUserBalanceDeducted(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'USER_BALANCE_DEDUCTED'> {
    return payload?.type === 'USER_BALANCE_DEDUCTED';
  }
  private isUserBalanceDeductionFailed(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'USER_BALANCE_DEDUCTION_FAILED'> {
    return payload?.type === 'USER_BALANCE_DEDUCTION_FAILED';
  }
  private isUserBalanceTopUpDone(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'USER_BALANCE_TOPPED_UP'> {
    return payload?.type === 'USER_BALANCE_TOPPED_UP';
  }
  private isUserBalanceTopUpFailed(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'USER_BALANCE_TOPUP_FAILED'> {
    return payload?.type === 'USER_BALANCE_TOPUP_FAILED';
  }
  private isCarReleased(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'CAR_RELEASED'> {
    return payload?.type === 'CAR_RELEASED';
  }
  private isCarReleaseFailed(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'CAR_RELEASE_FAILED'> {
    return payload?.type === 'CAR_RELEASE_FAILED';
  }

  protected async handleMessage(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): Promise<void> {
    try {
      const correlationId = payload.data.metadata?.correlationId;
      const eventMessageId = payload.data.metadata?.messageId;
      if (!correlationId) return;

      this.logger.log(
        `Return orchestrator received event: ${payload.type}, correlationId=${correlationId}`,
      );

      if (this.isReturnRequested(payload)) {
        const data = payload.data;
        await this.correlationManager.storePendingRequest(
          correlationId,
          data.rentalId,
          data,
        );

        await this.runOnce(eventMessageId, async () => {
          if (data.penalty) {
            await this.userCommandsProducer.sendEvent(
              {
                type: 'DEDUCT_USER_BALANCE',
                data: {
                  userId: data.userId,
                  amount: data.penalty,
                  metadata: {
                    replyTo: Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
                    correlationId,
                  },
                },
              },
              undefined,
              { partitionKey: correlationId },
            );
          } else if (data.refund) {
            await this.userCommandsProducer.sendEvent(
              {
                type: 'TOP_UP_USER_BALANCE',
                data: {
                  userId: data.userId,
                  amount: data.refund,
                  metadata: {
                    replyTo: Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
                    correlationId,
                  },
                },
              },
              undefined,
              { partitionKey: correlationId },
            );
          } else {
            await this.carCommandsProducer.sendEvent(
              {
                type: 'RELEASE_CAR',
                data: {
                  carId: data.carId,
                  metadata: {
                    replyTo: Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
                    correlationId,
                  },
                },
              },
              undefined,
              { partitionKey: correlationId },
            );
          }
        });
        return;
      }

      if (
        this.isUserBalanceDeducted(payload) ||
        this.isUserBalanceTopUpDone(payload)
      ) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;
          const returnPayload =
            pending.payload as OrchestratorEvents['RETURN_CAR'];

          await this.carCommandsProducer.sendEvent(
            {
              type: 'RELEASE_CAR',
              data: {
                carId: returnPayload.carId,
                metadata: {
                  replyTo: Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
                  correlationId,
                },
              },
            },
            undefined,
            { partitionKey: correlationId },
          );
        });
        return;
      }

      if (
        this.isUserBalanceDeductionFailed(payload) ||
        this.isUserBalanceTopUpFailed(payload)
      ) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;
          const returnPayload =
            pending.payload as OrchestratorEvents['RETURN_CAR'];

          await this.correlationManager.markRequestAsFailed(
            correlationId,
            payload.data.reason ?? 'Balance update failed',
          );

          this.rentalsService.emitRentalUpdate({
            userId: returnPayload.userId,
            rentalId: returnPayload.rentalId,
            status: 'ACTIVE',
            reason: payload.data.reason ?? 'Balance update failed',
          });
          await this.carCommandsProducer.sendEvent(
            {
              type: 'BOOK_CAR',
              data: {
                carId: returnPayload.carId,
                metadata: {
                  replyTo: Topics.RETURN_CAR_EVENTS_CHANNEL_TOPIC,
                  correlationId,
                },
              },
            },
            undefined,
            { partitionKey: correlationId },
          );
        });
        return;
      }

      if (this.isCarReleased(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;
          const returnPayload =
            pending.payload as OrchestratorEvents['RETURN_CAR'];

          await this.rentalCommandsProducer.sendEvent(
            {
              type: 'CLOSE_RENTAL',
              data: { rentalId: pending.entityId, metadata: { correlationId } },
            },
            undefined,
            { partitionKey: correlationId },
          );

          this.rentalsService.emitRentalUpdate({
            userId: returnPayload.userId,
            rentalId: returnPayload.rentalId,
            status: 'CLOSED',
          });

          await this.correlationManager.markRequestAsCompleted(correlationId);
        });
        return;
      }

      if (this.isCarReleaseFailed(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;
          const returnPayload =
            pending.payload as OrchestratorEvents['RETURN_CAR'];

          await this.correlationManager.markRequestAsFailed(
            correlationId,
            payload.data.reason ?? 'Car release failed',
          );

          if (returnPayload.penalty) {
            await this.userCommandsProducer.sendEvent(
              {
                type: 'TOP_UP_USER_BALANCE',
                data: {
                  userId: returnPayload.userId,
                  amount: returnPayload.penalty,
                  metadata: { correlationId },
                },
              },
              undefined,
              { partitionKey: correlationId },
            );
          }

          if (returnPayload.refund) {
            await this.userCommandsProducer.sendEvent(
              {
                type: 'DEDUCT_USER_BALANCE',
                data: {
                  userId: returnPayload.userId,
                  amount: returnPayload.refund,
                  metadata: { correlationId },
                },
              },
              undefined,
              { partitionKey: correlationId },
            );
          }

          this.rentalsService.emitRentalUpdate({
            userId: returnPayload.userId,
            rentalId: returnPayload.rentalId,
            status: 'ACTIVE',
            reason: payload.data.reason ?? 'Balance update failed',
          });
        });
        return;
      }

      this.logger.warn(`Unhandled event type: ${payload.type}`);
    } catch (err) {
      this.logger.error(
        `Error processing return event: ${(err as Error).message}`,
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
