import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { User } from './User';

import { v4 as uuid } from 'uuid';

@Entity({ name: 'addresses' })
class Address {
  @PrimaryColumn()
  id: string;

  @Column()
  zipcode: string;

  @Column()
  city: string;

  @Column()
  street: string;

  @Column()
  district: string;

  @Column({
    nullable: true,
    default: null,
  })
  uf: string;

  @Column({
    nullable: true,
    default: null,
  })
  description: string;

  @Column({
    nullable: true,
    default: null,
  })
  number: number;

  @Column({ name: 'user_id' })
  userId: string;

  @JoinColumn({ name: 'user_id' })
  @ManyToOne(() => User)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  /**
   * @public
   */
  public constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}

export { Address };
