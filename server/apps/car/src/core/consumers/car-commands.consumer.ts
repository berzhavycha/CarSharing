import { CorrelationManager } from '@app/shared';
import { CarCommands } from '@app/shared/contracts/car-commands.contract';
import { CarEvents } from '@app/shared/contracts/car-events.contract';
import { FileEvents } from '@app/shared/contracts/file-events.contract';
import { DedupConsumer } from '@app/shared/services/dedup-consumer.service';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { PULSAR_CLIENT } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { CAR_EVENTS_PRODUCER } from '../../helpers/constants/providers';
import { CarPhotoService } from '../../services/car-photo.service';
import { CarService } from '../../services/car.service';

export type Events = FileEvents & CarCommands;
export type EventPayload<E extends keyof Events> = { type: E; data: Events[E] };

function isUploadFileEvent(
  payload: EventPayload<keyof Events>,
): payload is EventPayload<'FILES_UPLOADED'> {
  return payload.type === 'FILES_UPLOADED';
}

function isVerifyCarAvailabilityEvent(
  payload: EventPayload<keyof Events>,
): payload is EventPayload<'CHECK_CAR_AVAILABILITY'> {
  return payload.type === 'CHECK_CAR_AVAILABILITY';
}

function isBookCarCommand(
  payload: EventPayload<keyof Events>,
): payload is EventPayload<'BOOK_CAR'> {
  return payload.type === 'BOOK_CAR';
}

function isReleaseCarCommand(
  payload: EventPayload<keyof Events>,
): payload is EventPayload<'RELEASE_CAR'> {
  return payload.type === 'RELEASE_CAR';
}

@Injectable()
export class CarCommandsConsumer extends DedupConsumer<
  EventPayload<keyof Events>
> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    private readonly carPhotoService: CarPhotoService,
    private readonly carService: CarService,
    correlationManager: CorrelationManager,
    @Inject(CAR_EVENTS_PRODUCER)
    private readonly carEventProducer: EventProducer<CarEvents>,
  ) {
    super(correlationManager, pulsarClient, {
      topic: Topics.CAR_COMMANDS_CHANNEL_TOPIC,
      subscriptionType: 'KeyShared',
      subscription: 'car-commands-subscription',
    });
  }

  protected async handleMessage(
    payload: EventPayload<keyof Events>,
  ): Promise<void> {
    try {
      this.logger.log(
        `CarCommandsConsumer received: ${JSON.stringify(payload)}`,
      );
      const eventMessageId = payload.data.metadata?.messageId;

      await this.runOnce(eventMessageId, async () => {
        if (isUploadFileEvent(payload)) {
          const { data } = payload;
          const pendingRequest =
            await this.correlationManager.getPendingRequest(
              data.metadata.correlationId,
            );
          if (!pendingRequest) {
            this.logger.warn(
              `No pending request found for correlation ID: ${data.metadata.correlationId}`,
            );
            return;
          }

          if (data.error) {
            this.logger.error(
              `Car photo upload failed for car ${pendingRequest.entityId}: ${data.error}`,
            );
            await this.correlationManager.markRequestAsFailed(
              data.metadata.correlationId,
              data.error,
            );
            return;
          }

          if (!data.files || data.files.length === 0) {
            this.logger.warn(
              `No files returned for car photo upload (correlationId: ${data.metadata.correlationId})`,
            );
            await this.correlationManager.markRequestAsFailed(
              data.metadata.correlationId,
              'No files uploaded',
            );
            return;
          }

          for (const file of data.files) {
            await this.carPhotoService.create({
              carId: pendingRequest.entityId,
              fileId: file.id,
              url: file.url,
            });
          }

          await this.correlationManager.markRequestAsCompleted(
            data.metadata.correlationId,
          );
          this.logger.log(
            `Successfully saved ${data.files.length} photos for car ${pendingRequest.entityId}`,
          );
        } else if (isVerifyCarAvailabilityEvent(payload)) {
          const { data } = payload;
          const isCarAvailable = await this.carService.isCarAvailable(
            data.carId,
          );

          if (data.metadata.replyTo) {
            await this.carEventProducer.sendEvent(
              {
                type: 'CAR_AVAILABILITY_CHECKED',
                data: {
                  carId: data.carId,
                  available: isCarAvailable,
                  metadata: { correlationId: data.metadata.correlationId },
                },
              },
              data.metadata.replyTo,
            );
          }
        } else if (isBookCarCommand(payload)) {
          await this.carService.bookCar({ ...payload.data, useOutbox: true });
        } else if (isReleaseCarCommand(payload)) {
          await this.carService.releaseCar({
            ...payload.data,
            useOutbox: true,
          });
        }
      });
    } catch (error) {
      this.logger.error(
        `Error processing car command: ${(error as Error).message}`,
        (error as Error).stack,
      );

      const correlationId = payload.data.metadata?.correlationId;
      if (correlationId) {
        await this.correlationManager.markRequestAsFailed(
          correlationId,
          (error as Error).message,
        );
      }
    }
  }
}
