import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Item } from './item.entity';
import { Store } from 'src/stores/entities/store.entity';

@Entity()
export class ItemVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Item, (item) => item.itemVariation)
  item: Item;

  @ManyToOne(() => Store, (store) => store.itemVariation)
  store: Store;

  @Column({ type: 'varchar', length: 255 })
  sku: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'int' })
  stock: number;

  @Column({ type: 'int', default: 0 })
  stockAlert: number; 

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
