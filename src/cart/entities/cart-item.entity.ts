// cart-item.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn
} from 'typeorm';
import { Cart } from './cart.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { ItemVariation } from 'src/item/entities/item-variation.entity';
import { StoreItemVariation } from 'src/stores/entities/store-item-variation.entity';

@Entity('cart_items')
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, cart => cart.items, { onDelete: 'CASCADE' })
  cart: Cart;

  @ManyToOne(() => StoreItem, storeProduct => storeProduct.cartItems)
  storeItem: StoreItem;

  @ManyToOne(() => StoreItemVariation, { nullable: true })
  storeItemVariation: StoreItemVariation;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'double', precision: 10, scale: 2 })
  price: number;

  @CreateDateColumn()
  created_at: Date;
}
