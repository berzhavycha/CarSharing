import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  DecimalColumnTransformer,
  USER_BALANCE_PRECISION,
  USER_BALANCE_SCALE,
} from '@/helpers';

import { Rental } from './rental.entity';
import { Role } from './role.entity';
import { Transaction } from './transaction.entity';

@Entity({ name: 'users', schema: 'auth' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  passwordHash: string;

  @Exclude()
  @Column()
  passwordSalt: string;

  @Exclude()
  @Column({ nullable: true })
  refreshTokenHash: string | null;

  @Exclude()
  @Column({ nullable: true })
  refreshTokenSalt: string | null;

  @Column({
    type: 'decimal',
    nullable: true,
    precision: USER_BALANCE_PRECISION,
    scale: USER_BALANCE_SCALE,
    transformer: new DecimalColumnTransformer(),
  })
  balance: number | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Rental, (rental) => rental.user)
  rentals: Rental[];

  @OneToMany(() => Transaction, (transaction) => transaction.user)
  transactions: Transaction[];
}
