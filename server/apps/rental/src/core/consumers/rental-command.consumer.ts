import { CorrelationManager } from '@app/shared';
import { RentalCommands } from '@app/shared/contracts/rental-commands.contract';
import { DedupConsumer } from '@app/shared/services/dedup-consumer.service';
import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { PULSAR_CLIENT } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { RentalsService } from '../../services/rentals.service';

export type Events = RentalCommands;
type EventPayload<E extends keyof Events> = {
  type: E;
  data: Events[E];
};

function isCancelRentalCommand(
  payload: EventPayload<keyof Events>,
): payload is EventPayload<'CANCEL_RENTAL'> {
  return payload.type === 'CANCEL_RENTAL';
}

function isConfirmRentalCommand(
  payload: EventPayload<keyof Events>,
): payload is EventPayload<'CONFIRM_RENTAL'> {
  return payload.type === 'CONFIRM_RENTAL';
}

function isCloseRental(
  payload: EventPayload<keyof Events>,
): payload is EventPayload<'CLOSE_RENTAL'> {
  return payload.type === 'CLOSE_RENTAL';
}

@Injectable()
export class RentalCommandsConsumer extends DedupConsumer<
  EventPayload<keyof Events>
> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    private readonly rentalService: RentalsService,
    correlationManager: CorrelationManager,
  ) {
    super(correlationManager, pulsarClient, {
      topic: Topics.RENTAL_COMMANDS_CHANNEL_TOPIC,
      subscription: 'rental-commands-sub',
      subscriptionType: 'KeyShared',
    });
  }

  protected async handleMessage(
    payload: EventPayload<keyof Events>,
  ): Promise<void> {
    this.logger.log(
      `RentalCommandsConsumer received event: ${JSON.stringify(payload)}`,
    );

    const correlationId = payload.data.metadata?.correlationId;
    const eventMessageId = payload.data.metadata?.messageId;
    if (!correlationId) return;

    if (isCancelRentalCommand(payload)) {
      await this.runOnce(eventMessageId, async () => {
        await this.rentalService.cancelRental({
          ...payload.data,
          useOutbox: true,
        });
      });
    }

    if (isConfirmRentalCommand(payload)) {
      await this.runOnce(eventMessageId, async () => {
        await this.rentalService.confirmRental({
          ...payload.data,
          useOutbox: true,
        });
      });
    }

    if (isCloseRental(payload)) {
      await this.runOnce(eventMessageId, async () => {
        await this.rentalService.completeRental({
          rentalId: payload.data.rentalId,
        });
      });
    }
  }
}
