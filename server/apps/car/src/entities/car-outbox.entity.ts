import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'car_outbox', schema: 'car' })
export class CarOutboxEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  topic: string;

  @Column('text')
  eventType: string;

  @Column('jsonb')
  payload: Record<string, any>;

  @Column({ name: 'partition_key', type: 'text', nullable: true })
  partitionKey?: string;

  @Column({ name: 'ordering_key', type: 'text', nullable: true })
  orderingKey?: string;

  @Column({ nullable: true })
  key?: string;

  @Column('jsonb', { default: () => "'{}'::jsonb" })
  headers: Record<string, string>;

  @Column({ type: 'varchar', default: 'PENDING' })
  status: 'PENDING' | 'IN_PROGRESS' | 'SENT' | 'FAILED';

  @Column({ type: 'int', default: 0 })
  attempts: number;

  @Column({ type: 'timestamptz', nullable: true })
  sendAfter?: Date;

  @Column({ type: 'text', nullable: true })
  lastError?: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'timestamptz', nullable: true })
  sentAt?: Date;
}
