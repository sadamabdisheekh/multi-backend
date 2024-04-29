import { Module } from '@nestjs/common';
import { SubCategoryService } from './sub-category.service';
import { SubCategoryController } from './sub-category.controller';
import { SubCategoryEntity } from './sub-category.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SubCategoryEntity])],

  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule { }
