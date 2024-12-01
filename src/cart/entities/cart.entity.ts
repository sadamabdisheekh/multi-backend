import { UserEntity } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { CartItem } from './cart-item.entity';


@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  cart_id: number;

  @ManyToOne(() => UserEntity, user => user.carts)
  @JoinColumn({name: 'userId'})
  user: UserEntity;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  cartItems: CartItem[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
