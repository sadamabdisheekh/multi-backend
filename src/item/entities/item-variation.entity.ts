import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Item } from "./item.entity";
import { StoreItemPrice } from "src/stores/entities/store-item-price.entity";
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

  @OneToMany(() => ItemVariationAttributeValue, vav => vav.variation)
  attributeValues: ItemVariationAttributeValue[];
  

  @OneToMany(() => StoreItemPrice, price => price.variation)
  prices: StoreItemPrice[];
}
