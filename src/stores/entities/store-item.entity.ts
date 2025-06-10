import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, OneToMany, JoinColumn } from 'typeorm';
import { Store } from './store.entity';
import { Item } from 'src/item/entities/item.entity';
import { ItemVariation } from 'src/item/entities/item-variation.entity';
import { CartItem } from 'src/cart/entities/cart-item.entity';
import { OrderItem } from 'src/order/entities/order-item.entity';
import { StoreItemPrice } from './store-item-price.entity';


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

    @OneToMany(() => StoreItemPrice, price => price.storeItem)
    prices: StoreItemPrice[];

    @OneToMany(() => CartItem, (cartItem) => cartItem.storeItem)
    cartItem: CartItem[];

    @OneToMany(() => OrderItem, orderItem => orderItem.storeItem)
    orderItems: OrderItem[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
}
