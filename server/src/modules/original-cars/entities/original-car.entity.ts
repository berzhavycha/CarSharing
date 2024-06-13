import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { CAR_PRICE_PRECISION, CAR_PRICE_SCALE, CAR_TYPE_LENGTH } from '@shared';

import { Rental } from '@modules/rentals/entities';

@Entity({ schema: 'rental', name: 'original_cars' })
@Check('"price_per_hour" > 0')
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
    precision: CAR_PRICE_PRECISION,
    scale: CAR_PRICE_SCALE,
  })
  pricePerHour: number;

  @Column({ type: 'varchar', length: CAR_TYPE_LENGTH })
  type: string;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @OneToMany(() => Rental, (rental) => rental.originalCar)
  rentals: Rental[];
}
