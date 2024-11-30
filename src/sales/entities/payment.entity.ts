import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class Payment {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.payment)
  order: Order;

  @Column()
  paymentMethod: string; // e.g., 'Credit Card', 'PayPal', 'Cash on Delivery'

  @Column()
  paymentAmount: number;

  @Column()
  paymentStatus: string; // e.g., 'Pending', 'Completed', 'Failed'

  @Column()
  transactionId: string; // ID for the transaction

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
