import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Car } from '@modules/cars/entities';
import { OriginalCar } from '@modules/original-cars/entities';
import { Transaction } from '@modules/transactions/entities';
import { User } from '@modules/users/entities';

import { RENTAL_STATUS_LENGTH, RentalStatus } from '../constants';

@Entity({ name: 'rentals', schema: 'rental' })
@Check('"rental_start" < "rental_end"')
export class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  rentalStart: Date;

  @Column({ type: 'timestamp' })
  rentalEnd: Date;

  @Column({
    type: 'varchar',
    length: RENTAL_STATUS_LENGTH,
    default: RentalStatus.ACTIVE,
  })
  status: RentalStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.rentals)
  @Index()
  user: User;

  @ManyToOne(() => Car, (car) => car.rentals)
  @Index()
  car: Car;

  @ManyToOne(() => OriginalCar, (originalCar) => originalCar.rentals)
  @Index()
  originalCar: OriginalCar;

  @OneToMany(() => Transaction, (transaction) => transaction.rental)
  transactions: Transaction[];
}
