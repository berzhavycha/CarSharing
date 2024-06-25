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
  CAR_DEFAULT_STEERING,
  CAR_FIELD_DEFAULT_PRECISION,
  CAR_FIELD_DEFAULT_SCALE,
  CAR_FIELD_MEDIUM_LENGTH,
  CarDefaultFuelCapacity,
  CarFuelType,
  DecimalColumnTransformer,
} from '@/helpers';

import { Rental } from './rental.entity';
import { LocalFile } from './local-file.entity';

@Entity({ schema: 'rental', name: 'original_cars' })
@Check('"price_per_hour" > 0')
@Check('"fuel_capacity" >= 0')
export class OriginalCar {
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

  @Column({ type: 'varchar', length: CAR_FIELD_MEDIUM_LENGTH })
  type: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Rental, (rental) => rental.originalCar)
  rentals: Rental[];

  @OneToMany(() => LocalFile, (localFile) => localFile.car, {
    cascade: true,
  })
  pictures: LocalFile[];
}
