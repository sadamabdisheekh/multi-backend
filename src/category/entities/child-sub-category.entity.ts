import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { SubCategoryEntity } from "./sub-category.entity";
import { Item } from "src/item/entities/item.entity";

@Entity('childsubcategory')
export class ChildSubCategoryEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => SubCategoryEntity, subCat => subCat.childSubcat)
    @JoinColumn({ name: 'sub_category_id' })
    subCategory: SubCategoryEntity;


    @Column()
    name: string

    @Column({ nullable: true })
    image: string;

    @Column({ default: true })
    status: boolean;

    @Column()
    created_at: Date;

    @OneToMany(() => Item, item => item.child_sub_category)
    item: Item[];
}
