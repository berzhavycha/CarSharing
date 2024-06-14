import {
  CAR_PRICE_PRECISION,
  CAR_PRICE_SCALE,
  CAR_STATUS_LENGTH,
  CAR_TYPE_LENGTH,
  CarStatus,
} from '@helpers';
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

import { Rental } from './rental.entity';

@Entity({ schema: 'rental', name: 'cars' })
@Check('"price_per_hour" > 0')
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
    precision: CAR_PRICE_PRECISION,
    scale: CAR_PRICE_SCALE,
  })
  pricePerHour: number;

  @Column({ type: 'varchar', length: CAR_TYPE_LENGTH })
  type: string;

  @Column({
    type: 'varchar',
    length: CAR_STATUS_LENGTH,
    default: CarStatus.AVAILABLE,
  })
  status: CarStatus;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => Rental, (rental) => rental.car)
  rentals: Rental[];
}
