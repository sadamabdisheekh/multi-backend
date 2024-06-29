import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemVariationAttributeService } from './item-variation-attribute.service';
import { CreateItemVariationAttributeDto } from './dto/create-item-variation-attribute.dto';
import { UpdateItemVariationAttributeDto } from './dto/update-item-variation-attribute.dto';

@Controller('item-variation-attribute')
export class ItemVariationAttributeController {
  constructor(private readonly itemVariationAttributeService: ItemVariationAttributeService) {}

  @Post()
  create(@Body() createItemVariationAttributeDto: CreateItemVariationAttributeDto) {
    return this.itemVariationAttributeService.create(createItemVariationAttributeDto);
  }

  @Get()
  findAll() {
    return this.itemVariationAttributeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemVariationAttributeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemVariationAttributeDto: UpdateItemVariationAttributeDto) {
    return this.itemVariationAttributeService.update(+id, updateItemVariationAttributeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemVariationAttributeService.remove(+id);
  }
}
