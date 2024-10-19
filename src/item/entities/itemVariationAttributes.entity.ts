import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ItemVariation } from './itemVariation.entity';
import { Attribute } from './attribute.entity';
import { AttributeValue } from './attributeValue.entity';

@Entity()
export class ItemVariationAttributes {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemVariation, (itemVariation) => itemVariation.id)
  itemVariation: ItemVariation;

  @ManyToOne(() => Attribute, (attribute) => attribute.id)
  attribute: Attribute;

  @ManyToOne(() => AttributeValue, (attributeValue) => attributeValue.id)
  attributeValue: AttributeValue;
}
