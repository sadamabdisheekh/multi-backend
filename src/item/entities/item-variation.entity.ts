import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { ItemVariationAttribute } from './item-variation-attribute.entity';

@Entity()
export class ItemVariation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Item, item => item.variations)
    item: Item;

    @Column({ unique: true })
    sku: string;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => ItemVariationAttribute, attribute => attribute.variation)
    attributes: ItemVariationAttribute[];
}
