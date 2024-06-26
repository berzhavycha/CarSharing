import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Car } from './car.entity';
import { OriginalCar } from './original-car.entity';
import { User } from './user.entity';

@Entity({ name: 'local_files' })
export class LocalFile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  path: string;

  @Column()
  mimetype: string;

  @ManyToOne(() => Car, (car) => car.pictures, { onDelete: 'CASCADE' })
  car: Car;

  @ManyToOne(() => OriginalCar, (car) => car.pictures, { onDelete: 'CASCADE' })
  originalCar: OriginalCar;

  @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  @JoinColumn({ name: 'avatar_id' })
  user?: User;
}
