import { ModuleZoneEntity } from 'src/module-zone/module-zone.entity';
import { Store } from 'src/stores/entities/store.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('zone')
export class ZoneEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text' }) // polygon
    coordinates: string;

    @Column({ default: true })
    status: boolean;

    @Column({ nullable: true })
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;

    @OneToMany(() => ModuleZoneEntity, moduleZone => moduleZone.zone)
    moduleZones: ModuleZoneEntity[];

    @OneToMany(() => Store, store => store.zone)
    store: Store[];

}
