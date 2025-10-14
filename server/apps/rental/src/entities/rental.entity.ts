import { DecimalColumnTransformer } from '@app/shared';
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  DEFAULT_PRICE,
  RENTAL_STATUS_LENGTH,
  RentalStatus,
} from '../helpers/constants';

@Entity({ name: 'rentals', schema: 'rental' })
@Check('"rental_start" < "rental_end"')
export class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  carId: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  rentalStart: Date;

  @Column({ type: 'timestamp', nullable: true })
  rentalEnd?: Date;

  @Column()
  requestedHours: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
    default: DEFAULT_PRICE,
  })
  totalPrice: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new DecimalColumnTransformer(),
  })
  pricePerHour: number;

  @Column({ default: '' })
  pickUpLocation: string;

  @Column({ default: '' })
  dropOffLocation: string;

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

  // @ManyToOne(() => User, (user) => user.rentals)
  // @Index()
  // user: User;

  // @ManyToOne(() => Car, (car) => car.rentals)
  // @Index()
  // car: Car;

  // @ManyToOne(() => OriginalCar, (originalCar) => originalCar.rentals)
  // @Index()
  // originalCar: OriginalCar;

  // @OneToMany(() => Transaction, (transaction) => transaction.rental)
  // transactions: Transaction[];
}
