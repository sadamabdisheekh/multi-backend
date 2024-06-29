import { AttributeValue } from 'src/variations/attribute/entities/attribute-value.entity';
import { Attribute } from 'src/variations/attribute/entities/attribute.entity';
import { ItemVariation } from 'src/variations/item-variation/entities/item-variation.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';


@Entity()
export class ItemVariationAttribute {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemVariation, itemVariation => itemVariation.itemVariationAttributes)
  itemVariation: ItemVariation;

  @ManyToOne(() => Attribute)
  attribute: Attribute;

  @ManyToOne(() => AttributeValue)
  attributeValue: AttributeValue;
}
