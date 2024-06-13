import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Rental } from '@modules/rentals/entities';

import { USER_BALANCE_PRECISION, USER_BALANCE_SCALE } from '../constants';

import { Role } from './role.entity';

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

  @Column()
  passwordHash: string;

  @Column({ nullable: true })
  refreshTokenHash: string | null;

  @Column({
    type: 'decimal',
    nullable: true,
    precision: USER_BALANCE_PRECISION,
    scale: USER_BALANCE_SCALE,
  })
  balance: number | null;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => Role, (role) => role.users)
  role: Role;

  @OneToMany(() => Rental, (rental) => rental.user, {
    onDelete: 'CASCADE',
  })
  rentals: Rental[];
}
