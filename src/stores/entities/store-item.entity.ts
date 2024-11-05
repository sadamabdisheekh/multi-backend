import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Store } from './store.entity';
import { Item } from 'src/item/entities/item.entity';
import { ItemVariation } from 'src/item/entities/item-variation.entity';


@Entity()
export class StoreItem {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Store, store => store.storeItems)
    store: Store;

    @ManyToOne(() => Item, item => item.variations)
    item: Item;

    @ManyToOne(() => ItemVariation, variation => variation.id, { nullable: true })
    variation: ItemVariation;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column()
    stock: number;

    @Column({ default: true })
    isAvailable: boolean;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
