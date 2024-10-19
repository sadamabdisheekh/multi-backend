import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity('brands') // You can customize the table name by passing a string
export class Brand {
  @PrimaryGeneratedColumn()
  brandId: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @OneToMany(() => Item, (item) => item.brand)
  item: Item[];
}
