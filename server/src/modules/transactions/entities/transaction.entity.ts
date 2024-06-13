import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Rental } from '@modules/rentals/entities';
import { User } from '@modules/users/entities';

import {
  TRANSACTION_AMOUNT_PRECISION,
  TRANSACTION_AMOUNT_SCALE,
  TransactionType,
} from '../constants';

@Entity({ name: 'transactions', schema: 'finance' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'decimal',
    precision: TRANSACTION_AMOUNT_PRECISION,
    scale: TRANSACTION_AMOUNT_SCALE,
  })
  amount: number;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.transactions)
  @Index()
  user: User;

  @ManyToOne(() => User, (rental) => rental.transactions)
  @Index()
  rental: Rental;
}
