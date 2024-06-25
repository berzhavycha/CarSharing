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
  CAR_DEFAULT_STEERING,
  CAR_FIELD_DEFAULT_PRECISION,
  CAR_FIELD_DEFAULT_SCALE,
  CAR_FIELD_MEDIUM_LENGTH,
  CAR_FIELD_SMALL_LENGTH,
  CarDefaultFuelCapacity,
  CarFuelType,
  CarStatus,
  DecimalColumnTransformer,
} from '@/helpers';

import { LocalFile } from './local-file.entity';
import { Rental } from './rental.entity';

@Entity({ schema: 'rental', name: 'cars' })
@Check('"price_per_hour" > 0')
@Check('"fuel_capacity" >= 0')
@Index(['type', 'capacity', 'pricePerHour'])
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  pricePerHour: number;

  @Column({ type: 'varchar', length: CAR_FIELD_MEDIUM_LENGTH })
  type: string;

  @Column({
    type: 'varchar',
    length: CAR_FIELD_SMALL_LENGTH,
    default: CarStatus.AVAILABLE,
  })
  status: CarStatus;

  @Column({ type: 'int' })
  capacity: number;

  @Column({
    type: 'varchar',
    length: CAR_FIELD_MEDIUM_LENGTH,
    default: CarFuelType.PETROL,
  })
  fuelType: string;

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
    default: CarDefaultFuelCapacity[CarFuelType.PETROL],
  })
  fuelCapacity: number;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Rental, (rental) => rental.car)
  rentals: Rental[];

  @OneToMany(() => LocalFile, (localFile) => localFile.car, {
    cascade: true,
  })
  pictures: LocalFile[];
}
