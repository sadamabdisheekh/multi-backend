import { Cart } from 'src/cart/entities/cart.entity';
import { Order } from 'src/order/entities/order.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from 'typeorm';
import { CustomerUser } from './customer-users.entity';

@Entity('customers')
export class Customer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column({ nullable: true })
  middleName: string;

  @Column()
  lastName: string;
  

  @Column({unique: true})
  mobile: string


  @Column({ unique: true , nullable: true})
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Cart, cart => cart.customer)
  carts: Cart[];

  @OneToMany(() => Order, order => order.customer)
  orders: Order[];

  @OneToOne(() => CustomerUser, customerUser => customerUser.customer)
  users: CustomerUser;
  
}
