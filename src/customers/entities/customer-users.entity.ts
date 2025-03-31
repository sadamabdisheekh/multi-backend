import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToOne, Unique, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';
import { Customer } from './customer.entity';
import { UserEntity } from 'src/users/user.entity';

@Entity('customer_users')
export class CustomerUser {

  @PrimaryColumn({ name: 'customer_id' })
  customerId: number;

  @PrimaryColumn({ name: 'user_id' })
  userId: number;

  @OneToOne(() => Customer, (customer) => customer.users)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @OneToOne(() => UserEntity, (user) => user.customerUser)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
    
    
