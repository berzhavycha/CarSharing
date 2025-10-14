import { CorrelationManager } from '@app/shared';
import { FileCommands } from '@app/shared/contracts/file-commands.contracts';
import { FileEvents } from '@app/shared/contracts/file-events.contract';
import { DedupConsumer } from '@app/shared/services/dedup-consumer.service';
import { EventProducer } from '@app/shared/services/event-producer.service';
import { Topics } from '@app/shared/topics';
import { Inject, Injectable } from '@nestjs/common';
import { PULSAR_CLIENT } from '@streamware/nestjs-pulsar';
import { Client } from 'pulsar-client';

import { FILE_EVENTS_PRODUCER } from '../../helpers/constants/providers';
import { FileService } from '../../services/file.service';

export type EventPayload<E extends keyof FileCommands> = {
  type: E;
  data: FileCommands[E];
};

function isUploadFilesCommand(
  payload: EventPayload<keyof FileCommands>,
): payload is EventPayload<'UPLOAD_FILES'> {
  return payload.type === 'UPLOAD_FILES';
}

function isDeleteFilesCommand(
  payload: EventPayload<keyof FileCommands>,
): payload is EventPayload<'DELETE_FILES'> {
  return payload.type === 'DELETE_FILES';
}

@Injectable()
export class FileCommandsConsumer extends DedupConsumer<
  EventPayload<keyof FileCommands>
> {
  constructor(
    @Inject(PULSAR_CLIENT) pulsarClient: Client,
    private readonly publicFileService: FileService,
    @Inject(FILE_EVENTS_PRODUCER)
    private readonly fileEventsProducer: EventProducer<FileEvents>,
    correlationManager: CorrelationManager,
  ) {
    super(correlationManager, pulsarClient, {
      topic: Topics.FILE_COMMANDS_CHANNEL_TOPIC,
      subscriptionType: 'Shared',
      subscription: 'file-upload-subscription',
    });
  }

  protected async handleMessage(
    payload: EventPayload<keyof FileCommands>,
  ): Promise<void> {
    try {
      const eventMessageId = payload.data.metadata?.messageId;

      await this.runOnce(eventMessageId, async () => {
        if (isUploadFilesCommand(payload)) {
          const savedFiles = [];

          for (const file of payload.data.files) {
            const fileDto = {
              ...file,
              buffer: Buffer.from(file.buffer, 'base64'),
            };
            const savedFile = await this.publicFileService.uploadFile(fileDto);
            savedFiles.push(savedFile);
          }

          if (payload.data.metadata.replyTo) {
            await this.fileEventsProducer.sendEvent({
              type: 'FILES_UPLOADED',
              data: {
                metadata: {
                  correlationId: payload.data.metadata.correlationId,
                },
                files: savedFiles.map((f) => ({ id: f.id, url: f.url })),
              },
            });
          }
        } else if (isDeleteFilesCommand(payload)) {
          const deletedFiles = [];
          for (const file of payload.data.filesToDelete) {
            const deletedFile = await this.publicFileService.removeFile(
              file.id,
            );
            deletedFiles.push(deletedFile);
          }
        }
      });
    } catch (err) {
      this.logger.error(
        `Error processing file command: ${(err as Error).message}`,
        (err as Error).stack,
      );

      const correlationId = payload.data.metadata?.correlationId;
      if (correlationId) {
        await this.correlationManager.markRequestAsFailed(
          correlationId,
          (err as Error).message,
        );
      }
    }
  }
}
