import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { ItemTypes } from './item-type.entity';
import { ItemVariation } from './item-variation.entity';
import { Category } from './category.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { ItemUnit } from './item-unit.entity';
import { ItemImage } from './item-images';

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

    @ManyToOne(() => ItemTypes, itemType => itemType.items)
    @JoinColumn({name: 'itemtypeid'})
    itemType: ItemTypes;

    @ManyToOne(() => ItemUnit, itemUnit => itemUnit.items)
    itemUnit: ItemTypes;

    @ManyToOne(() => Category, category => category.items)
    category: Category;

    @ManyToOne(() => Brand, brand => brand.items)
    brand: Brand;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => StoreItem, storeItem => storeItem.item)
    storeItem: StoreItem[];

    @OneToMany(() => ItemVariation, (itemVariation) => itemVariation.item)
    itemVariations: ItemVariation[];

    @OneToMany(() => ItemImage, (itemImage) => itemImage.item)
    images: ItemImage[];
}
