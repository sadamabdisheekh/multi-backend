import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemVariationService } from './item-variation.service';
import { CreateItemVariationDto } from './dto/create-item-variation.dto';
import { UpdateItemVariationDto } from './dto/update-item-variation.dto';

@Controller('item-variation')
export class ItemVariationController {
  constructor(private readonly itemVariationService: ItemVariationService) {}

  @Post()
  async create(@Body() createItemVariationDto: CreateItemVariationDto): Promise<any> {
    return await this.itemVariationService.create(createItemVariationDto);
  }

  @Get('report')
  async getItemVariationsReport() {
    return await this.itemVariationService.getItemVariationsReport();
  }

  @Get()
  findAll() {
    return this.itemVariationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.itemVariationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemVariationDto: UpdateItemVariationDto) {
    return this.itemVariationService.update(+id, updateItemVariationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemVariationService.remove(+id);
  }
}
