import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Attribute } from './attribute.entity';
import { ItemVariationAttribute } from './item-variation-attribute.entity';


@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, attribute => attribute.attributeValues)
  attribute: Attribute;

  @Column({ length: 255 })
  value: string;

  @OneToMany(() => ItemVariationAttribute, item => item.attributeValue)
  itemVariationattribute: ItemVariationAttribute[];
}
