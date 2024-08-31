import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttributeValue } from './attribute-value.entity';
import { ItemVariationAttribute } from './item-variation-attribute.entity';


@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => AttributeValue, attributeValue => attributeValue.attribute)
  attributeValues: AttributeValue[];

  @OneToMany(() => ItemVariationAttribute, item => item.attribute)
  itemVariationattribute: ItemVariationAttribute[];
}
