import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ schema: 'file' })
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  filename: string | null;

  @Column({ nullable: true })
  path: string | null;

  @Column({ nullable: true })
  mimetype: string | null;

  @Column()
  url: string;

  @Column({ nullable: true })
  key: string | null;

  @Column({ nullable: true })
  publicId: string | null;

  // @ManyToOne(() => Car, (car) => car.pictures, { onDelete: 'CASCADE' })
  // car: Car;

  // @ManyToOne(() => OriginalCar, (car) => car.pictures, { onDelete: 'CASCADE' })
  // originalCar: OriginalCar;

  // @OneToOne(() => User, { nullable: true, onDelete: 'CASCADE' })
  // @JoinColumn({ name: 'avatar_id' })
  // user?: User;
}
