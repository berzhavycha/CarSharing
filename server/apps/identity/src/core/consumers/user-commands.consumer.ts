import { CorrelationManager } from '@app/shared';
import { UserCommands } from '@app/shared/contracts/user-commands.contract';
import { DedupConsumer } from '@app/shared/services/dedup-consumer.service';
import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { PULSAR_CLIENT } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { UserService } from '../../services/user.service';

export type EventPayload<E extends keyof UserCommands> = {
  type: E;
  data: UserCommands[E];
};

function isCheckBalance(
  payload: EventPayload<keyof UserCommands>,
): payload is EventPayload<'CHECK_USER_BALANCE'> {
  return payload.type === 'CHECK_USER_BALANCE';
}
function isDeductBalance(
  payload: EventPayload<keyof UserCommands>,
): payload is EventPayload<'DEDUCT_USER_BALANCE'> {
  return payload.type === 'DEDUCT_USER_BALANCE';
}
function isTopUpBalance(
  payload: EventPayload<keyof UserCommands>,
): payload is EventPayload<'TOP_UP_USER_BALANCE'> {
  return payload.type === 'TOP_UP_USER_BALANCE';
}

@Injectable()
export class UserCommandsConsumer extends DedupConsumer<
  EventPayload<keyof UserCommands>
> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    private readonly userService: UserService,
    correlationManager: CorrelationManager,
  ) {
    super(correlationManager, pulsarClient, {
      topic: Topics.USER_COMMANDS_CHANNEL_TOPIC,
      subscriptionType: 'KeyShared',
      subscription: 'user-commands-subscription',
    });
  }

  protected async handleMessage(
    payload: EventPayload<keyof UserCommands>,
  ): Promise<void> {
    const correlationId = payload.data.metadata?.correlationId;
    const eventMessageId = payload.data.metadata?.messageId;
    if (!correlationId || !eventMessageId) return;

    try {
      if (isCheckBalance(payload)) {
        await this.runOnce(eventMessageId, async () => {
          const pending =
            await this.correlationManager.getPendingRequest(correlationId);
          if (!pending) return;

          const { userId, required_balance } = payload.data;
          const user = await this.userService.findById(userId);

          if (!user.balance || user.balance < required_balance) {
            await this.correlationManager.markRequestAsFailed(
              correlationId,
              `Insufficient balance (has=${user.balance}, required=${required_balance})`,
            );
            return;
          }

          this.logger.log(`Balance check passed for user=${userId}`);
        });
        return;
      }

      if (isDeductBalance(payload)) {
        await this.runOnce(eventMessageId, async () => {
          await this.userService.deductBalance({
            ...payload.data,
            useOutbox: true,
          });
          this.logger.log(
            `Deducted ${payload.data.amount} from user=${payload.data.userId}`,
          );
        });
        return;
      }

      if (isTopUpBalance(payload)) {
        await this.runOnce(eventMessageId, async () => {
          await this.userService.performTopUpTransaction({
            ...payload.data,
            useOutbox: true,
          });
          this.logger.log(
            `Topped up ${payload.data.amount} for user=${payload.data.userId}`,
          );
        });
        return;
      }

      this.logger.warn(`Unhandled user command: ${payload.type}`);
    } catch (err) {
      this.logger.error(
        `Error handling user command: ${(err as Error).message}`,
        (err as Error).stack,
      );
      if (correlationId) {
        await this.correlationManager.markRequestAsFailed(
          correlationId,
          (err as Error).message,
        );
      }
    }
  }
}
