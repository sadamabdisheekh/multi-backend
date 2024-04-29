import { Module } from '@nestjs/common';
import { ChildSubCategoryService } from './child-sub-category.service';
import { ChildSubCategoryController } from './child-sub-category.controller';
import { ChildSubCategoryEntity } from './entities/child-sub-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ChildSubCategoryEntity])],
  controllers: [ChildSubCategoryController],
  providers: [ChildSubCategoryService],
})
export class ChildSubCategoryModule { }
