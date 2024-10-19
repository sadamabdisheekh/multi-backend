import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ItemVariation } from './itemVariation.entity';
import { Store } from 'src/stores/entities/store.entity';

@Entity()
export class StoreInventory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Store, (store) => store.id)
  store: Store;

  @ManyToOne(() => ItemVariation, (itemVariation) => itemVariation.id)
  itemVariation: ItemVariation;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('int')
  stock: number;

  @Column('int')
  stock_alert: number;

  @Column({ type: 'time' })
  available_time_starts: string;

  @Column({ type: 'time' })
  available_time_ends: string;
}
