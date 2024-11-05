import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany } from 'typeorm';
import { Item } from './item.entity';

@Entity()
@Unique(["name"])
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ default: true }) // New field added here
  isActive: boolean;

  @OneToMany(() => Item, item => item.category)
  items: Item[];
}
