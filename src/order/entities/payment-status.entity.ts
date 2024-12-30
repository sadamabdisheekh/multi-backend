import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
  } from 'typeorm';
  import { Order } from './order.entity';
  
  @Entity('payment_statuses')
  export class PaymentStatus {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 50, unique: true })
    name: string;
  
    @Column({ type: 'text', nullable: true })
    description?: string;
  
    @CreateDateColumn({ type: 'timestamp' })
    dateCreated: Date;
  
    @OneToMany(() => Order, order => order.paymentStatus)
    orders: Order[];
  }
  