import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { ItemTypes } from './entities/item-type.entity';
import { Item } from './entities/item.entity';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { ItemVariation } from './entities/item-variation.entity';
import { ItemVariationAttribute } from './entities/item-variation-attribute.entity';
import { Attribute } from './entities/attribute.entity';
import { UploadService } from 'common/UploadService';

@Module({
  imports: [TypeOrmModule.forFeature([
    Category,Store,StoreItem,ItemTypes,
    Item,Brand,ItemVariation,ItemVariationAttribute,
    Attribute
  ])],
  controllers: [ItemController],
  providers: [ItemService,UploadService],
})
export class ItemModule {}
