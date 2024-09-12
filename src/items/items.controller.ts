import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Filter } from './dto/filter.dto';
import { ItemVariationDto } from './dto/item-variation.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) { }

  @Post()
  async create(@Body() createItemDto: CreateItemDto) {
    return await this.itemsService.create(createItemDto);
  }

  @Get()
  async findAll(): Promise<any> {
    return await this.itemsService.findAll();
  }

  @Post('/filter')
  async findItemsbyFilter(@Body() payload: Filter) {
    return await this.itemsService.findItemsByFilter(payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }

  @Get('/finditemtypes')
  async findItemTypes() {
    return await this.itemsService.findItemTypes();
  }

  @Get('/attributes')
  async getAttributes() {
    return await this.itemsService.getAttributes()
  }

  @Get('/itemdetails/:id')
  async findItemDetails(
    @Param('id') itemId: number
  ): Promise<any> {
    return await this.itemsService.findItemDetials(itemId);
  }

  @Get('/brands')
  async getAllBrands(): Promise<any> {
    return await this.itemsService.getAllBrands();
  }

  @Patch('/updateitemvariation/:id')
  async updateItemVariation(@Param('id') id: number, @Body() payload: ItemVariationDto) {
    return await this.itemsService.updateItemVariation(id, payload);
  }

  @Patch('/additemvariation')
  async addItemVariation(@Body() payload: ItemVariationDto) {
    return await this.itemsService.addItemVariation(payload);
  }
}
