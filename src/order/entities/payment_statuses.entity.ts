import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './orders.entity';

@Entity('payment_statuses')
export class PaymentStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g. 'Pending', 'Paid', 'Failed'

  @Column({ nullable: true })
  description?: string;

  @Column({ default: false })
  isFinal: boolean;

  @OneToMany(() => Order, order => order.paymentStatus)
  orders: Order[];
}
