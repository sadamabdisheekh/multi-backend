import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { Store } from 'src/stores/entities/store.entity';
import { ItemTypes } from './entities/itemType.entity';
import { Item } from './entities/item.entity';
import { Brand } from './entities/brand.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity,Store,ItemTypes,Item,Brand])],
  controllers: [ItemController],
  providers: [ItemService],
})
export class ItemModule {}
