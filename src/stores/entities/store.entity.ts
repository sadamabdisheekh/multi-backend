import { ZoneEntity } from 'src/zones/zone.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('stores')
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 20, unique: true })
  phone: string;

  @Column({ type: 'varchar', length: 100, nullable: true,unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logo: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  latitude: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  longitude: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ type: 'decimal'})
  minimum_order: number;

  @Column({ type: 'decimal', nullable: true })
  comission: number;

  @Column({default: false})
  status: boolean;

  @Column({ type: 'timestamp', nullable: true })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  updated_at: Date;

  @ManyToOne(() => ZoneEntity, zone => zone.store)
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;
}
