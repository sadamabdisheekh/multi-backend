
import { CategoryEntity } from 'src/category/entities/category.entity';
import { ChildSubCategoryEntity } from 'src/category/entities/child-sub-category.entity';
import { SubCategoryEntity } from 'src/category/entities/sub-category.entity';
import { Store } from 'src/stores/entities/store.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ItemVariationAttribute } from './item-variation-attribute.entity';
import { ItemsEntity } from './item.entity';
import { Brand } from './brand.entity';

@Entity()
export class ItemVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemsEntity, (item) => item.itemVariations)
  item: ItemsEntity;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ nullable: true })
  sku: string;

  @Column({type: 'int'})
  stock: number;

  @Column({type: 'int'})
  stockAlert: number;

  @ManyToOne(() => CategoryEntity, (category) => category.items)
  @JoinColumn({ name: 'category_id' })
  category: CategoryEntity;

  @ManyToOne(() => Store, (store) => store.item)
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => SubCategoryEntity, (subCategory) => subCategory.items, {
    nullable: true,
  })
  @JoinColumn({ name: 'sub_category_id' })
  subCategory: SubCategoryEntity;

  @ManyToOne(
    () => ChildSubCategoryEntity,
    (childSubCategory) => childSubCategory.items,
    { nullable: true },
  )
  @JoinColumn({ name: 'child_subcat_id' })
  childSubCategory: ChildSubCategoryEntity;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;


  @Column({ type: 'time', nullable: true })
  available_time_starts: string;

  @Column({ type: 'time',nullable: true })
  available_time_ends: string;

  @Column({type: 'text'})
  description:string

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @OneToMany(
    () => ItemVariationAttribute,
    (itemVariationAttribute) => itemVariationAttribute.itemVariation,
  )
  itemVariationAttributes: ItemVariationAttribute[];


  @ManyToOne(() => Brand, (brand) => brand.itemVariations, {nullable: true,})
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;
}
