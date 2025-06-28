import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, JoinColumn } from 'typeorm';
import { Order } from './orders.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { StoreItemVariation } from 'src/stores/entities/store-item-variation.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.orderItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => StoreItem)
  @JoinColumn({ name: 'store_item_id' })
  storeItem: StoreItem;

  @ManyToOne(() => StoreItemVariation)
  @JoinColumn({ name: 'store_item_variation_id' })
  storeItemVariation?: StoreItemVariation;

  @Column('int')
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number; // price per unit at time of purchase

  @Column('decimal', { precision: 10, scale: 2 })
  subtotal: number; // quantity * price
}
