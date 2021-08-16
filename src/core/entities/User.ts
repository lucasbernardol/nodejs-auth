import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Exclude } from 'class-transformer';
import { v4 as uuid } from 'uuid';

@Entity({ name: 'users' })
class User {
  @PrimaryColumn()
  id: string;

  public constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }

  @Column()
  name: string;

  @Column()
  username: string;

  @Column()
  email: string;

  @Exclude()
  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export { User };
