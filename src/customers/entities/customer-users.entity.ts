import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, Unique, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { UserEntity } from 'src/users/user.entity';

@Entity('customer_users')
export class CustomerUser {

  @PrimaryColumn({ name: 'customer_id' })
  customerId: number;

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => Customer, (customer) => customer.users)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => UserEntity, (user) => user.customers)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
    
    
