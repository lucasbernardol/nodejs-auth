import { Exclude } from 'class-transformer';

import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { v4 as uuid } from 'uuid';

@Entity({ name: 'users' })
class User {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  /**
   * -reset passowrd token.
   */
  @Exclude()
  @Column({ name: 'reset_token' })
  token: string;

  /**
   * - reset token expires.
   */
  @Exclude()
  @Column({ name: 'reset_token_expires' })
  expires: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { User };
