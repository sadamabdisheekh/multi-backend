import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { Store } from './store.entity';
import { Item } from 'src/item/entities/item.entity';
import { ItemVariation } from 'src/item/entities/item-variation.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { StoreItemVariation } from './store-item-variation.entity';


@Entity()
export class StoreItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Store, store => store.storeItems)
    @JoinColumn({ name: 'storeId' })
    store: Store;

    @ManyToOne(() => Item, item => item.storeItem)
    @JoinColumn({ name: 'itemId' })
    item: Item;

    @Column('double', { precision: 10, scale: 2 ,nullable: true})
    price: number;
  
    @Column('double', { precision: 10, scale: 2, nullable: true })
    cost: number;
  
    @Column({nullable: true})
    stock: number;
  
    @Column({ nullable: true })
    stockAlert: number;

    @Column({nullable: true})
    availableStock: number;

    @OneToMany(() => StoreItemVariation, price => price.storeItem)
    storeItemVariation: StoreItemVariation[];

    @OneToMany(() => CartItem, cartItem => cartItem.storeItem)
    cartItems: CartItem[];


    @OneToMany(() => OrderItem, orderItem => orderItem.storeItem)
    orderItems: OrderItem[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
