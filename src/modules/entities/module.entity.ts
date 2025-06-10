import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';

@Entity('modules')
export class ModuleEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    module_name: string;

    @Column({ nullable: true })
    image: string;

    @Column({ default: true })
    status: boolean;

    @Column({ nullable: true })
    icon: string;


    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ nullable: true })
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;
}
