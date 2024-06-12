import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Car } from '@modules/cars/entities';
import { OriginalCar } from '@modules/original-cars/entities';
import { User } from '@modules/users/entities';

import { RENTAL_STATUS_LENGTH, RentalStatus } from '../constants';

@Entity({ name: 'rentals', schema: 'rental' })
@Check('"rentalStart" < "rentalEnd"')
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
  user: User;

  @ManyToOne(() => Car, (car) => car.rentals)
  car: Car;

  @ManyToOne(() => OriginalCar, (originalCar) => originalCar.rentals)
  originalCar: OriginalCar;
}
