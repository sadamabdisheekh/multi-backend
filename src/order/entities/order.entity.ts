import { Customer } from 'src/customers/entities/customer.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { OrderItem } from './order-item.entity';
import { PaymentMethod } from './payment-method.entity';
import { OrderStatus } from './order-status.entity';
import { PaymentStatus } from './payment-status.entity';


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Customer, customer => customer.orders)
  customer: Customer;
  
  @Column({nullable: true})
  orderCode: string

  @OneToMany(() => OrderItem, orderItem => orderItem.order, { cascade: true })
  orderItems: OrderItem[];

  @ManyToOne(() => PaymentMethod, paymentMethod => paymentMethod.orders, { nullable: false })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => PaymentStatus, paymentStatus => paymentStatus.orders, { nullable: false })
  paymentStatus: PaymentStatus;

  @ManyToOne(() => OrderStatus, orderStatus => orderStatus.orders, { nullable: false })
  orderStatus: OrderStatus;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
  totalAmount: number;

  @CreateDateColumn({ type: 'timestamp' })
  orderDate: Date;  
}
