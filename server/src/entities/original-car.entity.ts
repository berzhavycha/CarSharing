import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import {
  CAR_DEFAULT_CAPACITY,
  CAR_DEFAULT_FUEL_CAPACITY,
  CAR_DEFAULT_GASOLINE,
  CAR_DEFAULT_STEERING,
  CAR_FIELD_DEFAULT_PRECISION,
  CAR_FIELD_DEFAULT_SCALE,
  CAR_FIELD_MEDIUM_LENGTH,
  DecimalColumnTransformer,
} from '@/helpers';

import { Rental } from './rental.entity';

@Entity({ schema: 'rental', name: 'original_cars' })
@Check('"price_per_day" > 0')
@Check('"fuel_capacity" >= 0')
export class OriginalCar {
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
  pricePerDay: number;

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

  @Column({ type: 'varchar', length: CAR_FIELD_MEDIUM_LENGTH })
  type: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Rental, (rental) => rental.originalCar)
  rentals: Rental[];
}
