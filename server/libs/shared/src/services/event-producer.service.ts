import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PULSAR_CLIENT } from '@streamware/nestjs-pulsar';
import { Client, Producer, ProducerMessage } from 'pulsar-client';
import { v4 as uuidv4 } from 'uuid';

import { ContractMetadata } from '../types/contracts';

export interface EventBase {
  metadata?: ContractMetadata & { [key: string]: unknown };
}

export type EventPayload<E extends EventBase> = {
  type: keyof E;
  data: E[keyof E];
};

@Injectable()
export class EventProducer<
    E extends Record<string, EventBase>,
    T extends string = string,
  >
  implements OnModuleInit, OnModuleDestroy
{
  private producers: Map<string, Producer> = new Map();

  constructor(
    @Inject(PULSAR_CLIENT) private readonly client: Client,
    private readonly defaultTopic?: T,
  ) {}

  async onModuleInit(): Promise<void> {
    if (this.defaultTopic) {
      const producer = await this.client.createProducer({
        topic: this.defaultTopic,
      });
      this.producers.set(this.defaultTopic, producer);
    }
  }

  async sendEvent<K extends keyof E>(
    payload: { type: K; data: E[K] },
    topic?: T,
    options?: Partial<ProducerMessage>,
  ): Promise<void> {
    const resolvedTopic = topic ?? this.defaultTopic;
    if (!resolvedTopic) {
      throw new Error('No topic provided to EventProducer');
    }

    if (!payload.data.metadata) {
      payload.data.metadata = {};
    }

    if (!payload.data.metadata.messageId) {
      payload.data.metadata.messageId = uuidv4();
    }

    let producer = this.producers.get(resolvedTopic);
    if (!producer) {
      producer = await this.client.createProducer({ topic: resolvedTopic });
      this.producers.set(resolvedTopic, producer);
    }

    const message: ProducerMessage = {
      data: Buffer.from(JSON.stringify(payload)),
      ...options,
    };

    await producer.send(message);
  }

  async onModuleDestroy(): Promise<void> {
    for (const producer of this.producers.values()) {
      await producer.close();
    }
  }
}
