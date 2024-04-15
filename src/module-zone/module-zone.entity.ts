import { ModuleEntity } from 'src/modules/module.entity';
import { ZoneEntity } from 'src/zones/zone.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('module_zone')
export class ModuleZoneEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ModuleEntity, module => module.moduleZones)
    @JoinColumn({ name: 'module_id' })
    module: ModuleEntity;

    @ManyToOne(() => ZoneEntity, zone => zone.moduleZones)
    @JoinColumn({ name: 'zone_id' })
    zone: ZoneEntity;

    @Column({ type: 'double', precision: 23, scale: 2, nullable: true })
    per_km_shipping_charge: number;

    @Column({ type: 'double', precision: 23, scale: 2, nullable: true })
    minimum_shipping_charge: number;

    @Column({ type: 'double', precision: 23, scale: 2, nullable: true })
    maximum_cod_order_amount: number;

    @Column({ type: 'double', precision: 23, scale: 2, nullable: true })
    maximum_shipping_charge: number;
}
