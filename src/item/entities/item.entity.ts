import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Brand } from './brand.entity';
import { ItemTypes } from './item-type.entity';
import { ItemVariation } from './item-variation.entity';
import { Category } from './category.entity';

@Entity()
export class Item {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @ManyToOne(() => ItemTypes, itemType => itemType.items)
    @JoinColumn({name: 'itemtypeid'})
    itemType: ItemTypes;

    @ManyToOne(() => Category, category => category.items)
    category: Category;

    @ManyToOne(() => Brand, brand => brand.items)
    brand: Brand;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @OneToMany(() => ItemVariation, variation => variation.item)
    variations: ItemVariation[];
}
