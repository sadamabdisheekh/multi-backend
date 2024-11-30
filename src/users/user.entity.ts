import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";
import { UserProfile } from "./user-profile.entity";
import { Cart } from "src/cart/entities/cart.entity";
import { Order } from "src/sales/entities/order.entity";

@Entity('users')
export class UserEntity extends BaseEntity {
    @PrimaryGeneratedColumn()
    userId: number;
    @Column({ nullable: true })
    firstName: string;
    @Column()
    middleName: string;
    @Column({ nullable: true })
    lastName: string;
    @Column({ default: true })
    isActive: boolean;
    @CreateDateColumn({ type: 'timestamp' })
    datecreated: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    dateModified: Date;
    @Column()
    @Unique(['mobile'])
    mobile: string;
    @Column()
    password: string;

    @OneToOne(() => UserProfile, profile => profile.user)
    profile: UserProfile;

    @OneToMany(() => Cart, cart => cart.user)
    carts: Cart[];

    @OneToMany(() => Order, order => order.user)
    orders: Order[];

}