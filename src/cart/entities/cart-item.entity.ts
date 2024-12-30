import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Item } from 'src/item/entities/item.entity';
import { Store } from 'src/stores/entities/store.entity';
import { ItemVariation } from 'src/item/entities/item-variation.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  // @ManyToOne(() => Cart, (cart) => cart.cartItems)
  // @JoinColumn({name: 'cartId'})
  // cart: Cart;

  @ManyToOne(() => Cart, cart => cart.cartItems, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => StoreItem, storeItem => storeItem.cartItem)
  storeItem: StoreItem;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
