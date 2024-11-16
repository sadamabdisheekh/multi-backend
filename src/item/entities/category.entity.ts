import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, CreateDateColumn } from 'typeorm';
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

  @Column()
  image: string

  @CreateDateColumn({type: 'timestamp'})
  created_at:Date

  @OneToMany(() => Item, item => item.category)
  items: Item[];
}
