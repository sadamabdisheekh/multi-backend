import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { ItemVariation } from 'src/item/entities/item-variation.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Item } from 'src/item/entities/item.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;

  @ManyToOne(() => Item,item => item.orderItem)
  item: Item;

  @ManyToOne(() => ItemVariation, variation => variation.orderItem, { nullable: true })
  variation: ItemVariation;

  @ManyToOne(() => Store, store => store.orderItem)
  store: Store;

  @Column()
  quantity: number;

  @Column()
  priceAtPurchase: number;

  @Column()
  total: number; // quantity * priceAtPurchase

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
