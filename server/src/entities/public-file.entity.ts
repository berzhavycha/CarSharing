import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Car } from './car.entity';
import { OriginalCar } from './original-car.entity';
import { User } from './user.entity';

@Entity()
export class PublicFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  url: string;

  @Column()
  key: string;

  @ManyToOne(() => Car, (car) => car.pictures, { onDelete: 'CASCADE' })
  car: Car;

  @ManyToOne(() => OriginalCar, (car) => car.pictures, { onDelete: 'CASCADE' })
  originalCar: OriginalCar;

  @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'avatar_id' })
  user?: User;
}
