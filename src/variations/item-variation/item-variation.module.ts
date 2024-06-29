import { Module } from '@nestjs/common';
import { ItemVariationService } from './item-variation.service';
import { ItemVariationController } from './item-variation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemVariation } from './entities/item-variation.entity';
import { ItemsEntity } from 'src/items/entities/item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ItemsEntity,ItemVariation])],
  controllers: [ItemVariationController],
  providers: [ItemVariationService],
})
export class ItemVariationModule {}
