import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

export enum IdempotencyStatus {
  PENDING = 'pending',
  COMPLETE = 'complete',
}

@Entity('idempotency_records')
export class IdempotencyRecord {
  @PrimaryColumn()
  key: string;

  @Column({ name: 'payload_hash' })
  payloadHash: string;

  @Column({ type: 'varchar', default: IdempotencyStatus.PENDING })
  status: IdempotencyStatus;

  @Column({ type: 'jsonb', nullable: true })
  result: object | null;

  @Index()
  @Column({ name: 'expires_at', type: 'timestamptz' })
  expiresAt: Date;
}