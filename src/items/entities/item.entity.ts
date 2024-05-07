import { CategoryEntity } from "src/category/category.entity";
import { ChildSubCategoryEntity } from "src/child-sub-category/entities/child-sub-category.entity";
import { SubCategoryEntity } from "src/sub-category/sub-category.entity";
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
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;

    @ManyToOne(() => SubCategoryEntity, subCategory => subCategory.items)
    @JoinColumn({ name: 'subCategoryId' })
    subCategory: SubCategoryEntity;

    @ManyToOne(() => ChildSubCategoryEntity, childSubCategory => childSubCategory.items)
    @JoinColumn({ name: 'childSubcatId' })
    childSubCategory: ChildSubCategoryEntity;
}
