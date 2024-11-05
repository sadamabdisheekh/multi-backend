import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Attribute } from './attribute.entity';

@Entity()
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, attribute => attribute.values)
  attribute: Attribute;

  @Column()
  name: string;
}
