import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemsEntity } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryModule } from 'src/category/category.module';
import { CategoryEntity } from 'src/category/category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemsEntity,CategoryEntity])
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule {}
