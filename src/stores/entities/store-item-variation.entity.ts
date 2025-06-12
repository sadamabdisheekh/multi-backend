import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { StoreItem } from "./store-item.entity";
import { ItemVariation } from "src/item/entities/item-variation.entity";

@Entity('store_item_variation')
export class StoreItemVariation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StoreItem, storeItem => storeItem.storeItemVariation)
  storeItem: StoreItem;

  @ManyToOne(() => ItemVariation, { nullable: true })
  variation: ItemVariation;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2,nullable: true })
  cost: number;

  @Column()
  stock: number;

  @Column({ nullable: true })
  stockAlert: number;

  @Column({ type: 'date' })
  availableFrom: Date;

  @Column({ type: 'date', nullable: true })
  availableTo: Date;
}
