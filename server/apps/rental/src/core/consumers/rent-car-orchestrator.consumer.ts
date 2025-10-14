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

export type OrchestratorEvents = RentalEvents &
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
export class RentCarOrchestratorConsumer extends DedupConsumer<
  EventPayload<keyof OrchestratorEvents>
> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    @Inject(CAR_COMMANDS_PRODUCER)
    private readonly carCommandsProducer: EventProducer<CarCommands>,
    @Inject(RENTAL_COMMANDS_PRODUCER)
    private readonly rentalCommandsProducer: EventProducer<RentalCommands>,
    @Inject(USER_COMMANDS_PRODUCER)
    private readonly userCommandsProducer: EventProducer<UserCommands>,
    private readonly rentalsService: RentalsService,
    correlationManager: CorrelationManager,
  ) {
    super(correlationManager, pulsarClient, {
      topic: Topics.RENT_CAR_EVENTS_CHANNEL_TOPIC,
      subscription: 'rent-car-saga-orchestrator-sub',
      subscriptionType: 'KeyShared',
    });
  }

  private isRentalCreated(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'RENTAL_CREATED'> {
    return payload?.type === 'RENTAL_CREATED';
  }
  private isCarAvailabilityChecked(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'CAR_AVAILABILITY_CHECKED'> {
    return payload?.type === 'CAR_AVAILABILITY_CHECKED';
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
  private isCarBooked(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'CAR_BOOKED'> {
    return payload?.type === 'CAR_BOOKED';
  }
  private isCarBookingRejected(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): payload is EventPayload<'CAR_BOOKING_REJECTED'> {
    return payload?.type === 'CAR_BOOKING_REJECTED';
  }

  protected async handleMessage(
    payload: EventPayload<keyof OrchestratorEvents>,
  ): Promise<void> {
    try {
      this.logger.log(`Received event: ${JSON.stringify(payload)}`);
      const correlationId = payload.data.metadata?.correlationId;
      const eventMessageId = payload.data.metadata?.messageId;
      if (!correlationId) return;

      if (this.isRentalCreated(payload)) {
        const rental = payload.data;
        await this.correlationManager.storePendingRequest(
          correlationId,
          rental.id,
          rental,
        );

        await this.runOnce(eventMessageId, async () => {
          await this.carCommandsProducer.sendEvent(
            {
              type: 'CHECK_CAR_AVAILABILITY',
              data: {
                carId: rental.carId,
                metadata: {
                  replyTo: Topics.RENT_CAR_EVENTS_CHANNEL_TOPIC,
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

      if (this.isCarAvailabilityChecked(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;

          const rental =
            pending.payload as OrchestratorEvents['RENTAL_CREATED'];

          if (!payload.data.available) {
            await this.rentalCommandsProducer.sendEvent(
              {
                type: 'CANCEL_RENTAL',
                data: {
                  rentalId: pending.entityId,
                  reason: 'Car not available',
                  metadata: { correlationId },
                },
              },
              undefined,
              { partitionKey: correlationId },
            );
            this.rentalsService.emitRentalUpdate({
              userId: rental.userId,
              rentalId: rental.id,
              status: 'CANCELLED',
              reason: 'Car not available',
            });
            return;
          }

          await this.userCommandsProducer.sendEvent(
            {
              type: 'DEDUCT_USER_BALANCE',
              data: {
                userId: rental.userId,
                amount: rental.totalPrice,
                metadata: {
                  replyTo: Topics.RENT_CAR_EVENTS_CHANNEL_TOPIC,
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

      if (this.isUserBalanceDeducted(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;
          const rental =
            pending.payload as OrchestratorEvents['RENTAL_CREATED'];

          await this.carCommandsProducer.sendEvent(
            {
              type: 'BOOK_CAR',
              data: {
                carId: rental.carId,
                metadata: {
                  replyTo: Topics.RENT_CAR_EVENTS_CHANNEL_TOPIC,
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

      if (this.isUserBalanceDeductionFailed(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;

          const rental =
            pending.payload as OrchestratorEvents['RENTAL_CREATED'];

          await this.rentalCommandsProducer.sendEvent(
            {
              type: 'CANCEL_RENTAL',
              data: {
                rentalId: pending.entityId,
                reason: 'Balance deduction failed',
                metadata: { correlationId },
              },
            },
            undefined,
            { partitionKey: correlationId },
          );
          this.rentalsService.emitRentalUpdate({
            userId: rental.userId,
            rentalId: rental.id,
            status: 'CANCELLED',
            reason: 'Balance deduction failed',
          });
        });
        return;
      }

      if (this.isCarBooked(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;

          const rental =
            pending.payload as OrchestratorEvents['RENTAL_CREATED'];

          await this.rentalCommandsProducer.sendEvent(
            {
              type: 'CONFIRM_RENTAL',
              data: { rentalId: pending.entityId, metadata: { correlationId } },
            },
            undefined,
            { partitionKey: correlationId },
          );

          this.rentalsService.emitRentalUpdate({
            userId: rental.userId,
            rentalId: rental.id,
            status: 'CONFIRMED',
          });
        });
        return;
      }

      if (this.isCarBookingRejected(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;
          const rental =
            pending.payload as OrchestratorEvents['RENTAL_CREATED'];

          await this.userCommandsProducer.sendEvent(
            {
              type: 'TOP_UP_USER_BALANCE',
              data: {
                userId: rental.userId,
                amount: rental.totalPrice,
                metadata: { correlationId },
              },
            },
            undefined,
            { partitionKey: correlationId },
          );

          await this.rentalCommandsProducer.sendEvent(
            {
              type: 'CANCEL_RENTAL',
              data: {
                rentalId: pending.entityId,
                reason: 'Car booking rejected',
                metadata: { correlationId },
              },
            },
            undefined,
            { partitionKey: correlationId },
          );

          this.rentalsService.emitRentalUpdate({
            userId: rental.userId,
            rentalId: rental.id,
            status: 'CANCELLED',
            reason: 'Car booking rejected',
          });
        });
        return;
      }

      this.logger.warn(`Unhandled event type: ${payload.type}`);
    } catch (err) {
      this.logger.error(
        `Error processing event: ${(err as Error).message}`,
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
