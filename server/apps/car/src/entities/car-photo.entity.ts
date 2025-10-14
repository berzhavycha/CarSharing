import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Car } from './car.entity';
import { OriginalCar } from './original-car.entity';

@Entity({ schema: 'car' })
@Check(`"car_id" IS NOT NULL OR "original_car_id" IS NOT NULL`)
export class CarPhoto {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column({ nullable: true })
  fileId: string | null;

  @Column({ nullable: true })
  carId: string | null;

  @Column({ nullable: true })
  originalCarId: string | null;

  @ManyToOne(() => Car, (car) => car.pictures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @ManyToOne(() => OriginalCar, (car) => car.pictures, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'original_car_id' })
  originalCar: OriginalCar;
}
