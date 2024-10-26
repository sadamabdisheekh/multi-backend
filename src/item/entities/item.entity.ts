import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Brand } from './brand.entity';
import { ItemTypes } from './itemType.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { SubCategoryEntity } from 'src/category/entities/sub-category.entity';
import { ChildSubCategoryEntity } from 'src/category/entities/child-sub-category.entity';
import { ItemVariation } from './itemVariation.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => CategoryEntity, (category) => category.items)
  category: CategoryEntity;

  @ManyToOne(() => SubCategoryEntity, (subCategory) => subCategory.item)
  sub_category: SubCategoryEntity;

  @ManyToOne(() => ChildSubCategoryEntity, (ch_s_category) => ch_s_category.item)
  child_sub_category: ChildSubCategoryEntity;

  @ManyToOne(() => Brand, (brand) => brand.item)
  brand: Brand;

  @ManyToOne(() => ItemTypes, (itemType) => itemType.items)
  itemType: ItemTypes;

  @Column({ type: 'decimal', precision: 10, scale: 2,nullable: true })
  price: number;

  @Column({ type: 'int', nullable: true })
  stock: number;

  @Column({ type: 'int', default: 0 ,nullable:true})
  stockAlert: number; 

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => ItemVariation, itemVariation => itemVariation.item)
  itemVariation: ItemVariation[];
}
