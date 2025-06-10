import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Attribute } from "./attribute.entity";

@Entity('attribute_values')
export class AttributeValue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Attribute, attr => attr.values)
  attribute: Attribute;

  @Column()
  value: string;
}
