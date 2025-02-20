import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { StoreItem } from "src/stores/entities/store-item.entity";
import { ItemVariation } from "src/item/entities/item-variation.entity";

@Entity()
export class StoreItemVariation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => StoreItem, storeItem => storeItem.storeItemVariation)
    storeItem: StoreItem;

    @ManyToOne(() => ItemVariation, variation => variation.storeItemPrice, { nullable: true })
    itemVariation: ItemVariation;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({type: 'int'})
    stock: number;

    @Column({ type: 'int' })
    availableStock: number;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}