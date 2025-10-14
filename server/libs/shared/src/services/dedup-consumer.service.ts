import { CorrelationManager } from '@app/shared';
import { Logger } from '@nestjs/common';
import { PulsarConsumer } from '@streamware/nestjs-pulsar';
import { Client, ConsumerConfig } from 'pulsar-client';

export abstract class DedupConsumer<T> extends PulsarConsumer<T> {
  protected readonly logger = new Logger(this.constructor.name);

  constructor(
    protected readonly correlationManager: CorrelationManager,
    client: Client,
    private readonly options: ConsumerConfig,
  ) {
    super(client, options);
  }

  protected async runOnce(
    messageId: string,
    handler: () => Promise<void>,
  ): Promise<void> {
    const isProcessed =
      await this.correlationManager.isMessageProcessed(messageId);
    if (isProcessed) {
      this.logger.warn(`Duplicate detected for message "${messageId}"`);
      return;
    }

    await handler();
    await this.correlationManager.markMessageProcessed(messageId);
  }
}
