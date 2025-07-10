import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, OneToOne } from 'typeorm';
import { Brand } from './brand.entity';
import { ItemVariation } from './item-variation.entity';
import { Category } from './category.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { ItemUnit } from './item-unit.entity';
import { ItemImage } from './item-images.entity';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column('text', {nullable: true})
    thumbnail: string

    @Column({ default: false })
    hasVariations: boolean;


    @ManyToOne(() => ItemUnit, itemUnit => itemUnit.items)
    @JoinColumn({ name: 'itemUnitId' })
    itemUnit: ItemUnit;

    @ManyToOne(() => Category, category => category.items)
    category: Category;

    @ManyToOne(() => Brand, brand => brand.items)
    brand: Brand;

    @OneToOne(() => StoreItem, storeItem => storeItem.item)
    storeItem: StoreItem[];

    @OneToMany(() => ItemVariation, (itemVariation) => itemVariation.item)
    variations: ItemVariation[];

    @OneToMany(() => ItemImage, (itemImage) => itemImage.item)
    images: ItemImage[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;


}
