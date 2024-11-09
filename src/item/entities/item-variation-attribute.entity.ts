import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ItemVariation } from './item-variation.entity';
import { Attribute } from './attribute.entity';
import { AttributeValue } from './attribute-value.entity';

@Entity()
export class ItemVariationAttribute  {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ItemVariation, variation => variation.attributes)
  itemVariation: ItemVariation;

  @ManyToOne(() => AttributeValue, value => value.id)
  attributeValue: AttributeValue;
}
