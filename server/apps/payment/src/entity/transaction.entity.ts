import { DecimalColumnTransformer } from '@app/shared';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  TRANSACTION_AMOUNT_PRECISION,
  TRANSACTION_AMOUNT_SCALE,
  TransactionType,
} from '../helpers';

@Entity({ name: 'transactions', schema: 'payment' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: TRANSACTION_AMOUNT_PRECISION,
    scale: TRANSACTION_AMOUNT_SCALE,
    transformer: new DecimalColumnTransformer(),
  })
  amount: number;

  @Column({ type: 'uuid', nullable: true })
  userId?: string;

  @Column({ type: 'uuid', nullable: true })
  rentalId?: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
