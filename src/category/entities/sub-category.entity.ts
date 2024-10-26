import { CategoryEntity } from 'src/category/entities/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ChildSubCategoryEntity } from './child-sub-category.entity';
import { Item } from 'src/item/entities/item.entity';

@Entity('subcategory')
export class SubCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => CategoryEntity, zone => zone.subCategory)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;
  @Column()
  subCategoryName: string;
  @Column({ nullable: true })
  image: string;
  @Column({ default: false })
  status: boolean;

  @OneToMany(() => ChildSubCategoryEntity, childSubcat => childSubcat.subCategory)
  childSubcat: ChildSubCategoryEntity[];

  @OneToMany(() => Item, item => item.sub_category)
  item: Item[];
}
