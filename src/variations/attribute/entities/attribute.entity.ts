import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { AttributeValue } from './attribute-value.entity';


@Entity()
export class Attribute {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @OneToMany(() => AttributeValue, attributeValue => attributeValue.attribute)
  attributeValues: AttributeValue[];
}
