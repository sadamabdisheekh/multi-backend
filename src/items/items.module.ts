import { Module } from '@nestjs/common';
import { ItemsService } from './items.service';
import { ItemsController } from './items.controller';
import { ItemsEntity } from './entities/item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { Store } from 'src/stores/entities/store.entity';
import { ItemTypes } from './entities/item-type.entity';
import { Attribute } from './entities/attribute.entity';
import { ItemVariation } from './entities/item-variation.entity';
import { ItemVariationAttribute } from './entities/item-variation-attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { SubCategoryEntity } from 'src/category/entities/sub-category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ItemsEntity,Attribute,
      AttributeValue,ItemVariation,ItemVariationAttribute, 
      CategoryEntity,SubCategoryEntity, Store,ItemTypes
    ])
  ],
  controllers: [ItemsController],
  providers: [ItemsService],
})
export class ItemsModule { }
