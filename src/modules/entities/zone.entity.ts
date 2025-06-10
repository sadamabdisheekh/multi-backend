
import { Store } from 'src/stores/entities/store.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('zone')
export class ZoneEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ type: 'text',nullable: true }) // polygon
    coordinates: string;

    @Column({ default: true })
    status: boolean;

    @Column({ nullable: true })
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;


    @OneToMany(() => Store, store => store.zone)
    store: Store[];

}
