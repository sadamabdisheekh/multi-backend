import { ModuleEntity } from 'src/modules/module.entity';
import { SubCategoryEntity } from 'src/sub-category/sub-category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

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

}
