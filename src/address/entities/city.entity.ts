import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Region } from './region.entity';
import { Village } from './village.entity';

@Entity()
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @ManyToOne(() => Region, region => region.cities)
  region: Region;

  @OneToMany(() => Village, village => village.city)
  villages: Village[];
}
