// cart.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn
} from 'typeorm';
import { Store } from '../../stores/entities/store.entity';
import { CartItem } from './cart-item.entity';
import { UserEntity } from 'src/users/user.entity';
import { join } from 'path';

@Entity('carts')
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, user => user.carts, { nullable: true })
  @JoinColumn({ name: 'userId'})
  user: UserEntity;

  @ManyToOne(() => Store, store => store.carts)
  store: Store;

  @Column({ default: 'active' })
  status: 'active' | 'ordered' | 'abandoned';

  @OneToMany(() => CartItem, item => item.cart, { cascade: true })
  items: CartItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
