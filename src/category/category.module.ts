import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { CategoryEntity } from './entities/category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoryEntity } from './entities/sub-category.entity';
import { ChildSubCategoryEntity } from './entities/child-sub-category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryEntity,ChildSubCategoryEntity,CategoryEntity])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule { }
