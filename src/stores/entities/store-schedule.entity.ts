import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Store } from './store.entity';

@Entity()
export class StoreSchedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  dayOfWeek: string;  // e.g., 'Monday', 'Tuesday', ...

  @Column({nullable: true})
  openTime: string;  // e.g., '09:00'

  @Column({nullable: true})
  closeTime: string;  // e.g., '18:00'

  @Column({ default: true })
  isOpen: boolean;  // Whether the store is open on this day

  @ManyToOne(() => Store, store => store.schedules)
  store: Store;
}
