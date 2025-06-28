import { Store } from 'src/stores/entities/store.entity';
import { UserEntity } from 'src/users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { OrderStatus } from './order_statuses.entity';
import { PaymentStatus } from './payment_statuses.entity';
import { PaymentMethod } from './payment-method.entity';
import { OrderItem } from './order_items.entity';


@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable: true})
  orderCode: string

  // User who placed the order
  @ManyToOne(() => UserEntity, { eager: false })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  // Store the order is for
  @ManyToOne(() => Store, { eager: false })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  // Status of the order (e.g., Pending, Shipped, Delivered)
  @ManyToOne(() => OrderStatus, { eager: true })
  @JoinColumn({ name: 'order_status_id' })
  orderStatus: OrderStatus;

  // Status of payment (e.g., Paid, Failed)
  @ManyToOne(() => PaymentStatus, { eager: true })
  @JoinColumn({ name: 'payment_status_id' })
  paymentStatus: PaymentStatus;

  // Method of payment (e.g., Card, PayPal)
  @ManyToOne(() => PaymentMethod, { eager: true })
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  // Items in the order
  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  orderItems: OrderItem[];

  // Total price of the order
  @Column('decimal', { precision: 10, scale: 2 })
  totalPrice: number;

  // Timestamps
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
