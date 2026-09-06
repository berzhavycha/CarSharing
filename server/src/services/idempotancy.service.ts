import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createHash } from 'crypto';
import { EntityManager } from 'typeorm';

import { IdempotencyRecord, IdempotencyStatus } from '@/entities';

const IDEMPOTENCY_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

@Injectable()
export class IdempotencyService {
  hashPayload(payload: object): string {
    return createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  }

  async handleIdempotency<T extends object>(
    key: string,
    payloadHash: string,
    manager: EntityManager,
  ): Promise<T | null> {
    const expiresAt = new Date(Date.now() + IDEMPOTENCY_TTL_MS);

    // Attempt to insert a pending record. The primary key constraint means
    // only one concurrent request wins the insert — all others hit the conflict
    // and skip the insert. Every request then falls through to the locked read.
    const insertResult = await manager
      .createQueryBuilder()
      .insert()
      .into(IdempotencyRecord)
      .values({ key, payloadHash, status: IdempotencyStatus.PENDING, result: null, expiresAt })
      .onConflict('("key") DO NOTHING')
      .execute();

    const isOwner = insertResult.raw.length > 0; // true if this request inserted the row


    // SELECT FOR UPDATE blocks any concurrent request that lost the insert race
    // until the winning request either commits (releasing the lock with a
    // COMPLETE record) or rolls back (releasing the lock with the row deleted
    // or still PENDING, causing the retry to reprocess).
    const record = await manager
      .getRepository(IdempotencyRecord)
      .createQueryBuilder('ir')
      .setLock('pessimistic_write')
      .where('ir.key = :key', { key })
      .getOne();

    if (!record) {
        // A rolled back and took the pending row with it.
        // Re-insert so this request now owns the key before processing.
        await manager
            .createQueryBuilder()
            .insert()
            .into(IdempotencyRecord)
            .values({ key, payloadHash, status: IdempotencyStatus.PENDING, result: null, expiresAt })
            .execute(); // No ON CONFLICT needed — we just confirmed no row exists
        return null;
    }

    // Expired record — delete and let the request reprocess.
    if (record.expiresAt < new Date()) {
      await manager.delete(IdempotencyRecord, { key });
      return null;
    }

    // Different payload on an existing key → 422.
    if (record.payloadHash !== payloadHash) {
      throw new UnprocessableEntityException(
        'Idempotency key already used with a different payload. Generate a new key for this request.',
      );
    }

    // A concurrent request is still processing → 409.
    // The FOR UPDATE above means this branch is only reached if the first
    // request rolled back and left a PENDING row behind (e.g. a DB error
    // mid-transaction). A true in-flight concurrent request would be
    // blocked at the FOR UPDATE until the first request commits or rolls back.
    if (record.status === IdempotencyStatus.PENDING && !isOwner) {
      throw new ConflictException(
        'A request with this idempotency key is already being processed. Retry after a moment.',
      );
    }

    // Completed matching retry → return the original response.
    return record.result as T;
  }

  async completeRecord<T extends object>(
    key: string,
    result: T,
    manager: EntityManager,
  ): Promise<void> {
    await manager.update(IdempotencyRecord, { key }, {
      status: IdempotencyStatus.COMPLETE,
      result,
    });
  }
}