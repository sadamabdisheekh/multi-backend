import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { Item } from './item.entity';
  
  @Entity('item_images')
  export class ItemImage {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column({ type: 'varchar', length: 255 })
    image_url: string;
  
  
    @ManyToOne(() => Item, (item) => item.images, { onDelete: 'CASCADE' })
    item: Item;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  }
  