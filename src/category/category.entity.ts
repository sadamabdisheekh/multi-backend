import { ItemsEntity } from 'src/items/entities/item.entity';
import { ModuleEntity } from 'src/modules/module.entity';
import { SubCategoryEntity } from 'src/sub-category/sub-category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => ModuleEntity, module => module.category)
    @JoinColumn({ name: 'moduleId' })
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

    @OneToMany(() => ItemsEntity, item => item.category)
    items: ItemsEntity[];

}
