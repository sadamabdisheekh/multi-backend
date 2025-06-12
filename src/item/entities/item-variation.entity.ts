import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";
import { StoreItemVariation } from "src/stores/entities/store-item-variation.entity";
import { ItemVariationAttributeValue } from "./item-variation-attribute-value.entity";

@Entity('item_variations')
export class ItemVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, item => item.variations)
  item: Item;

  @Column()
  sku: string;

  @Column()
  variationName: string;

  @OneToMany(() => ItemVariationAttributeValue, vav => vav.itemVariation)
  attributeValues: ItemVariationAttributeValue[];
  

  @OneToMany(() => StoreItemVariation, price => price.variation)
  prices: StoreItemVariation[];
}
