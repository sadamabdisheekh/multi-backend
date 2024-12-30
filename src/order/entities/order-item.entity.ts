import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, order => order.orderItems, { nullable: false, onDelete: 'CASCADE' })
  order: Order;


  @ManyToOne(() => StoreItem, storeProduct => storeProduct.orderItems, { nullable: false })
  storeItem: StoreItem;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;
}
