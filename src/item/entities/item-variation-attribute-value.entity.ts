import { Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ItemVariation } from "./item-variation.entity";
import { Attribute } from "./attribute.entity";
import { AttributeValue } from "./attribute-value.entity";

@Entity('item_variation_attribute_values')
export class ItemVariationAttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemVariation, variation => variation.attributeValues)
  variation: ItemVariation;

  @ManyToOne(() => Attribute, attribute => attribute.id)
  attribute: Attribute;

  @ManyToOne(() => AttributeValue, value => value.id)
  attributeValue: AttributeValue;
}
