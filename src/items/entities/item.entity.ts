import { CategoryEntity } from "src/category/category.entity";
import { ChildSubCategoryEntity } from "src/child-sub-category/entities/child-sub-category.entity";
import { Store } from "src/stores/entities/store.entity";
import { SubCategoryEntity } from "src/sub-category/sub-category.entity";
import { ItemVariation } from "src/variations/item-variation/entities/item-variation.entity";
import { PrimaryGeneratedColumn, Column, OneToMany, Entity, ManyToOne, JoinColumn } from "typeorm";

@Entity('items')
export class ItemsEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column('text', { nullable: true })
    description: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToOne(() => CategoryEntity, category => category.items)
    @JoinColumn({ name: 'category_id' })
    category: CategoryEntity;

    @ManyToOne(() => Store, store => store.item)
    @JoinColumn({ name: 'store_id' })
    store: Store;

    @ManyToOne(() => SubCategoryEntity, subCategory => subCategory.items, { nullable: true })
    @JoinColumn({ name: 'sub_category_id', })
    subCategory: SubCategoryEntity;

    @ManyToOne(() => ChildSubCategoryEntity, childSubCategory => childSubCategory.items, { nullable: true })
    @JoinColumn({ name: 'child_subcat_id' })
    childSubCategory: ChildSubCategoryEntity;

    @Column({ type: 'decimal' })
    price: number;

    @Column({ type: 'decimal', nullable: true })
    discount: number;

    @Column({ type: 'time' })
    available_time_starts: string;

    @Column({ type: 'time' })
    available_time_ends: string;

    @OneToMany(() => ItemVariation, itemVariation => itemVariation.item)
    itemVariations: ItemVariation[];
}
