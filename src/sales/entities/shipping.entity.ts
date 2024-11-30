import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Shipping {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.shipping)
  order: Order;

  @Column()
  shippingAddress: string;

  @Column()
  shippingStatus: string; // e.g., 'Pending', 'Shipped', 'Delivered'

  @Column()
  trackingNumber: string;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
