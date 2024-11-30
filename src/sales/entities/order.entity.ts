import { UserEntity } from 'src/users/user.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, OneToMany, Column, JoinColumn } from 'typeorm';
import { Shipping } from './shipping.entity';
import { Payment } from './payment.entity';
import { OrderItem } from './order-item.entity';


@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn({name: 'userId'})
  user: UserEntity;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
  orderItems: OrderItem[];

  @ManyToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

  @ManyToOne(() => Shipping, (shipping) => shipping.order)
  shipping: Shipping;

  @Column()
  totalPrice: number;

  @Column()
  status: string; // e.g., 'Pending', 'Shipped', 'Completed'

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}
