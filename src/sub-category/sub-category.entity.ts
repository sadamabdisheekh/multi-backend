import { CategoryEntity } from 'src/category/category.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity('subcategory')
export class SubCategoryEntity {
    @PrimaryGeneratedColumn()
    subCategoryId: number;
    @ManyToOne(() => CategoryEntity, zone => zone.subCategory)
    @JoinColumn({ name: 'categoryId' })
    category: CategoryEntity;
    @Column()
    subCategoryName: string;
    @Column()
    image: string;
    @Column({ default: true })
    status: boolean;
}
