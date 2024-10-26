import { ModuleEntity } from 'src/modules/module.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { SubCategoryEntity } from './sub-category.entity';
import { Item } from 'src/item/entities/item.entity';

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ModuleEntity, module => module.category)
    @JoinColumn({ name: 'modul_id' })
    module: ModuleEntity;

    @Column()
    name: string;

    @Column()
    image: string;

    @Column({ default: true })
    status: boolean;

    @Column()
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;

    @Column({ default: 0 })
    priority: number;

    @OneToMany(() => SubCategoryEntity, module => module.category)
    subCategory: SubCategoryEntity[];

    @OneToMany(() => Item, (item) => item.category)
    items: Item[];

}
