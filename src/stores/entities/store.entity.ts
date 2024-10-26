import { ZoneEntity } from 'src/zones/zone.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { StoreSchedule } from './store-schedule.entity';
import { ItemVariation } from 'src/item/entities/itemVariation.entity';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ type: 'double' })
  latitude: string;

  @Column({ type: 'double' })
  longitude: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ nullable: true })
  minimum_order?: number;

  @Column({ type: 'decimal', nullable: true })
  comission: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @ManyToOne(() => ZoneEntity, zone => zone.store)
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;


  @OneToMany(() => StoreSchedule, schedule => schedule.store)
  schedules: StoreSchedule[];

  @OneToMany(() => ItemVariation, itemVariation => itemVariation.store)
  itemVariation: ItemVariation[];
}
