import { ItemsEntity } from "src/items/entities/item.entity";
import { SubCategoryEntity } from "src/sub-category/sub-category.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('childsubcategory')
export class ChildSubCategoryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SubCategoryEntity, subCat => subCat.childSubcat)
    @JoinColumn({ name: 'subCategoryId' })
    subCategory: SubCategoryEntity;


    @Column()
    name: string

    @Column({ nullable: true })
    image: string;

    @Column({ default: true })
    status: boolean;

    @Column()
    created_at: Date;

    @OneToMany(() => ItemsEntity, item => item.childSubCategory)
    items: ItemsEntity[];
}
