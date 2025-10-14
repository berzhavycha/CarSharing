import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ schema: 'auth' })
export class UserAvatar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  url: string | null;

  @Column({ nullable: true })
  fileId: string | null;

  @Column()
  userId: string;

  @OneToOne(() => User, (user) => user.avatar, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
