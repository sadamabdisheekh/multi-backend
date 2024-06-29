import { ItemsEntity } from 'src/items/entities/item.entity';
import { ItemVariationAttribute } from 'src/variations/item-variation-attribute/entities/item-variation-attribute.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class ItemVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemsEntity, item => item.itemVariations)
  item: ItemsEntity;

  @Column({nullable: true})
  sku: string;

  @Column('int')
  stock: number;

  @Column('decimal', { precision: 10, scale: 2 ,default: 0})
  additionalPrice: number;

  @OneToMany(() => ItemVariationAttribute, itemVariationAttribute => itemVariationAttribute.itemVariation)
  itemVariationAttributes: ItemVariationAttribute[];
}
