import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { User } from './user.entity';
import { OauthClient } from './oauth-client.entity';

@Entity({ name: 'oauth_codes' })
export class OauthCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  codeHash: string;

  @Column()
  redirectUri: string;

  @Column()
  codeChallenge: string;

  @Column()
  codeChallengeMethod: string;

  @Column()
  scopes: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  isUsed: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @ManyToOne(() => OauthClient, { onDelete: 'CASCADE' })
  @JoinColumn()
  client: OauthClient;
}