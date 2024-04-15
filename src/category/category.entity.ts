import { ModuleEntity } from 'src/modules/module.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column({ nullable: true, default: null })
    parent_id: number;

    @Column({ default: 0 })
    position: number;

    @Column({ default: true })
    status: boolean;

    @Column()
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;

    @Column({ default: 0 })
    priority: number;

    @ManyToOne(() => CategoryEntity, parent => parent.children)
    parent: CategoryEntity;

    @OneToMany(() => CategoryEntity, children => children.parent)
    children: CategoryEntity[];

}
