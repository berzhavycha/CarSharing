import { RentalEvents } from '@app/shared/contracts/rental-events.contract';
import { EventProducer } from '@app/shared/services/event-producer.service';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { DataSource, LessThanOrEqual } from 'typeorm';

import { RentalOutboxEntity } from '../entities/rental-outbox.entity';
import { RENTAL_EVENTS_PRODUCER } from '../helpers/constants/providers';

const BATCH_SIZE = 20;
const MAX_RETRIES = 5;
const BASE_BACKOFF_MS = 1000;

function backoffMs(attempts: number): number {
  const ms = Math.pow(2, attempts) * BASE_BACKOFF_MS;
  const jitter = Math.floor(Math.random() * 300);
  return ms + jitter;
}

@Injectable()
export class OutboxPublisherService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger(OutboxPublisherService.name);
  private timer?: NodeJS.Timeout;
  private stopped = false;

  constructor(
    private readonly dataSource: DataSource,
    @Inject(RENTAL_EVENTS_PRODUCER)
    private readonly eventProducer: EventProducer<RentalEvents>,
  ) {}

  onModuleInit(): void {
    this.start();
  }

  onModuleDestroy(): void {
    this.stop();
  }

  start(pollIntervalMs = 1000): void {
    if (this.timer) return;
    this.timer = setInterval(
      () => this.processBatch().catch((err) => this.logger.error(err)),
      pollIntervalMs,
    );
  }

  stop(): void {
    this.stopped = true;
    if (this.timer) clearInterval(this.timer);
    this.timer = undefined;
  }

  private async processBatch(): Promise<void> {
    if (this.stopped) return;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    let rows: RentalOutboxEntity[] = [];

    try {
      await queryRunner.startTransaction();

      rows = await queryRunner.manager.find(RentalOutboxEntity, {
        where: [
          { status: 'PENDING', sendAfter: null },
          { status: 'PENDING', sendAfter: LessThanOrEqual(new Date()) },
        ],
        order: { createdAt: 'ASC' },
        take: BATCH_SIZE,
        lock: { mode: 'pessimistic_write' },
      });

      if (!rows.length) {
        await queryRunner.commitTransaction();
        return;
      }

      for (const row of rows) {
        row.status = 'IN_PROGRESS';
        row.attempts += 1;
        row.updatedAt = new Date();
        await queryRunner.manager.save(row);
      }

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }

    for (const row of rows) {
      try {
        await this.eventProducer.sendEvent(
          {
            type: row.eventType as keyof RentalEvents,
            data: row.payload as RentalEvents[keyof RentalEvents],
          },
          row.topic,
          {
            partitionKey: row.partitionKey,
          },
        );

        row.status = 'SENT';
        row.sentAt = new Date();
        row.lastError = null;
        await this.dataSource.getRepository(RentalOutboxEntity).save(row);
      } catch (err) {
        const attempts = row.attempts;
        const lastErr = (err as Error).message ?? String(err);

        if (attempts >= MAX_RETRIES) {
          row.status = 'FAILED';
          row.lastError = lastErr;
          await this.dataSource.getRepository(RentalOutboxEntity).save(row);
          this.logger.error(
            `Outbox row ${row.id} permanently failed: ${lastErr}`,
          );
        } else {
          row.status = 'PENDING';
          row.sendAfter = new Date(Date.now() + backoffMs(attempts));
          row.lastError = lastErr;
          await this.dataSource.getRepository(RentalOutboxEntity).save(row);
        }
      }
    }
  }
}
