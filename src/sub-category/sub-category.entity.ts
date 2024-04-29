import { CategoryEntity } from 'src/category/category.entity';
import { ChildSubCategoryEntity } from 'src/child-sub-category/entities/child-sub-category.entity';
import { ItemsEntity } from 'src/items/entities/item.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('subcategory')
export class SubCategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => CategoryEntity, zone => zone.subCategory)
  @JoinColumn({ name: 'categoryId' })
  category: CategoryEntity;
  @Column()
  subCategoryName: string;
  @Column()
  image: string;
  @Column({ default: true })
  status: boolean;

  @OneToMany(() => ChildSubCategoryEntity, childSubcat => childSubcat.subCategory)
  childSubcat: ChildSubCategoryEntity[];

  @OneToMany(() => ItemsEntity, item => item.subCategory)
  items: ItemsEntity[];
}
