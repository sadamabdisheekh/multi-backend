import { Module } from '@nestjs/common';
import { ItemVariationAttributeService } from './item-variation-attribute.service';
import { ItemVariationAttributeController } from './item-variation-attribute.controller';
import { ItemVariationAttribute } from './entities/item-variation-attribute.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Attribute } from '../attribute/entities/attribute.entity';
import { AttributeValue } from '../attribute/entities/attribute-value.entity';
import { ItemVariation } from '../item-variation/entities/item-variation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Attribute,AttributeValue,ItemVariation,ItemVariationAttribute])],
  controllers: [ItemVariationAttributeController],
  providers: [ItemVariationAttributeService],
})
export class ItemVariationAttributeModule {}
