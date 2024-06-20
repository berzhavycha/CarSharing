import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import {
  CAR_DEFAULT_CAPACITY,
  CAR_DEFAULT_FUEL_CAPACITY,
  CAR_DEFAULT_GASOLINE,
  CAR_DEFAULT_STEERING,
  CAR_FIELD_DEFAULT_PRECISION,
  CAR_FIELD_DEFAULT_SCALE,
  CAR_FIELD_MEDIUM_LENGTH,
  CAR_FIELD_SMALL_LENGTH,
  CarStatus,
  DecimalColumnTransformer,
} from '@/helpers';

import { Rental } from './rental.entity';

@Entity({ schema: 'rental', name: 'cars' })
@Check('"price_per_day" > 0')
@Check('"fuel_capacity" >= 0')
@Index(['type', 'capacity', 'pricePerDay'])
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  imageUrl: string;

  @Column()
  @Index()
  model: string;

  @Column({ type: 'int' })
  year: number;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'decimal',
    precision: CAR_FIELD_DEFAULT_PRECISION,
    scale: CAR_FIELD_DEFAULT_SCALE,
    transformer: new DecimalColumnTransformer(),
  })
  @Index()
  pricePerDay: number;

  @Column({ type: 'varchar', length: CAR_FIELD_MEDIUM_LENGTH })
  type: string;

  @Column({
    type: 'varchar',
    length: CAR_FIELD_SMALL_LENGTH,
    default: CarStatus.AVAILABLE,
  })
  status: CarStatus;

  @Column({ type: 'int', default: CAR_DEFAULT_CAPACITY })
  capacity: number;

  @Column({
    type: 'varchar',
    length: CAR_FIELD_MEDIUM_LENGTH,
    default: CAR_DEFAULT_GASOLINE,
  })
  gasoline: string;

  @Column({
    type: 'varchar',
    length: CAR_FIELD_MEDIUM_LENGTH,
    default: CAR_DEFAULT_STEERING,
  })
  steering: string;

  @Column({
    type: 'decimal',
    precision: CAR_FIELD_DEFAULT_PRECISION,
    scale: CAR_FIELD_DEFAULT_SCALE,
    transformer: new DecimalColumnTransformer(),
    default: CAR_DEFAULT_FUEL_CAPACITY,
  })
  fuelCapacity: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Rental, (rental) => rental.car)
  rentals: Rental[];
}
