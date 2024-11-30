import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Cart } from './cart.entity';
import { Item } from 'src/item/entities/item.entity';
import { Store } from 'src/stores/entities/store.entity';
import { ItemVariation } from 'src/item/entities/item-variation.entity';

@Entity()
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Cart, (cart) => cart.cartItems)
  @JoinColumn({name: 'cartId'})
  cart: Cart;

  @ManyToOne(() => Item, item => item.cartItem)
  item: Item;

  @ManyToOne(() => ItemVariation,variation => variation.cartItem, { nullable: true })
  variation: ItemVariation;

  @ManyToOne(() => Store, store => store.cartItem)
  store: Store;

  @Column()
  quantity: number;

  @Column()
  price: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
