import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './orders.entity';

@Entity('order_statuses')
export class OrderStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g. 'Pending', 'Shipped', 'Delivered'

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isFinal: boolean;

  @OneToMany(() => Order, order => order.orderStatus)
  orders: Order[];
}
