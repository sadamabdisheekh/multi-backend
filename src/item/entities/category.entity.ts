import { Entity, PrimaryGeneratedColumn, Column, Unique, OneToMany, CreateDateColumn, ManyToOne, UpdateDateColumn, JoinColumn } from 'typeorm';
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

  @Column({ nullable: true })
  parentId: number | null;

  @ManyToOne(() => Category, (category) => category.children,{nullable: true})
  @JoinColumn({ name: 'parentId' })
  parent: Category;

  @OneToMany(() => Category, (category) => category.parent,{nullable: true})
  children: Category[];

  @CreateDateColumn({type: 'timestamp'})
  createdAt:Date

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Item, item => item.category)
  items: Item[];
}
