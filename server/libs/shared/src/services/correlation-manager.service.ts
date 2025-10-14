// correlation-manager.service.ts
import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';

export type RequestStatus = 'pending' | 'completed' | 'failed';

export interface PendingRequest<T = unknown> {
  correlationId: string;
  entityId: string;
  payload: T;
  status: RequestStatus;
  createdAt: string;
  error?: string;
  sagaSteps?: Record<string, RequestStatus>;
}

@Injectable()
export class CorrelationManager {
  private readonly logger = new Logger(CorrelationManager.name);
  private readonly redis: Redis;
  private readonly ttl = 5 * 60;

  constructor() {
    this.redis = new Redis({
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
    });
  }

  private getMessageKey(messageId: string): string {
    return `message:${messageId}`;
  }

  private getRequestKey(correlationId: string): string {
    return `pending_request:${correlationId}`;
  }

  async isMessageProcessed(messageId: string): Promise<boolean> {
    const exists = await this.redis.get(this.getMessageKey(messageId));
    return !!exists;
  }

  async markMessageProcessed(messageId: string): Promise<void> {
    await this.redis.set(this.getMessageKey(messageId), 'done', 'EX', this.ttl);
    this.logger.log(`Message processed: ${messageId}`);
  }

  async storePendingRequest<T>(
    correlationId: string,
    entityId: string,
    payload: T,
  ): Promise<void> {
    const request = {
      correlationId,
      entityId,
      payload,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };
    await this.redis.set(
      this.getRequestKey(correlationId),
      JSON.stringify(request),
      'EX',
      this.ttl,
    );
    this.logger.log(`Stored pending request: ${correlationId}`);
  }

  async getPendingRequest<T = unknown>(
    correlationId: string,
  ): Promise<PendingRequest<T> | null> {
    const data = await this.redis.get(this.getRequestKey(correlationId));
    return data ? (JSON.parse(data) as PendingRequest<T>) : null;
  }

  async markRequestAsCompleted(correlationId: string): Promise<void> {
    const request = await this.getPendingRequest(correlationId);
    if (!request) return;

    request.status = 'completed';
    await this.redis.set(
      this.getRequestKey(correlationId),
      JSON.stringify(request),
      'EX',
      30,
    );
    this.logger.log(`Request ${correlationId} marked as completed`);
  }

  async markRequestAsFailed(
    correlationId: string,
    error: string,
  ): Promise<void> {
    const request = await this.getPendingRequest(correlationId);
    if (!request) return;

    request.status = 'failed';
    request.error = error;
    await this.redis.set(
      this.getRequestKey(correlationId),
      JSON.stringify(request),
      'EX',
      this.ttl,
    );
    this.logger.error(`Request ${correlationId} failed: ${error}`);
  }
}
