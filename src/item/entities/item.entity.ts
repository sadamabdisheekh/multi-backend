import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Category } from './category.entity';
import { Brand } from './brand.entity';
import { ItemTypes } from './itemType.entity';

@Entity()
export class Item {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column('text')
  description: string;

  @ManyToOne(() => Category, (category) => category.items)
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.item)
  brand: Brand;

  @ManyToOne(() => ItemTypes, (itemType) => itemType.items)
  itemType: ItemTypes;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
