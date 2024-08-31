import { CategoryEntity } from 'src/category/entities/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { ChildSubCategoryEntity } from './child-sub-category.entity';
import { ItemVariation } from 'src/items/entities/item-variation.entity';

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

  @OneToMany(() => ItemVariation, item => item.subCategory)
  items: ItemVariation[];
}
