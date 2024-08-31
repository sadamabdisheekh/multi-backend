import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Attribute } from "./attribute.entity";
import { ItemVariation } from "./item-variation.entity";
import { AttributeValue } from "./attribute-value.entity";

@Entity()
export class ItemVariationAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemVariation, itemVariation => itemVariation.itemVariationAttributes)
  itemVariation: ItemVariation;

  @ManyToOne(() => Attribute, attr => attr.itemVariationattribute)
  attribute: Attribute;

  @ManyToOne(() => AttributeValue, att => att.itemVariationattribute)
  attributeValue: AttributeValue;


  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
}
