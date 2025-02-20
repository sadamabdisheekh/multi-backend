import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
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
    store: Store;

    @ManyToOne(() => Item, item => item.storeItem)
    item: Item;

    @ManyToOne(() => ItemVariation, variation => variation.storeItem, { nullable: true })
    itemVariation: ItemVariation;

    @Column('decimal', { precision: 10, scale: 2, nullable: true })
    price: number;

    @Column({type: 'int',nullable: true})
    stock: number;

    @Column({ type: 'int' ,nullable: true})
    availableStock: number;

    @Column({ default: true })
    isAvailable: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => StoreItemVariation, storeItemPrice => storeItemPrice.storeItem)
    storeItemVariation: StoreItemVariation[];

    @OneToMany(() => CartItem, (cartItem) => cartItem.storeItem)
    cartItem: CartItem[];

    @OneToMany(() => OrderItem, orderItem => orderItem.storeItem)
    orderItems: OrderItem[];
}
