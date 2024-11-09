import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { ItemVariationAttribute } from './item-variation-attribute.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';

@Entity()
export class ItemVariation {
    @PrimaryGeneratedColumn()
    id: number;


    @Column({ unique: true })
    sku: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @ManyToOne(() => Item, item => item.itemVariations)
    item: Item;

    @OneToMany(() => ItemVariationAttribute, attribute => attribute.itemVariation)
    attributes: ItemVariationAttribute[];
    
    @OneToMany(() => StoreItem, storeItem => storeItem.itemVariation)
    storeItem: StoreItem[];
    
}
