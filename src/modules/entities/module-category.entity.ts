import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ModuleEntity } from "./module.entity";
import { Category } from "src/item/entities/category.entity";

// module-category.entity.ts
@Entity('module_categories')
export class ModuleCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ModuleEntity, (module) => module.moduleCategories, { onDelete: 'CASCADE' })
  module: ModuleEntity;

  @ManyToOne(() => Category, (category) => category.moduleCategories, { onDelete: 'CASCADE' })
  category: Category;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
