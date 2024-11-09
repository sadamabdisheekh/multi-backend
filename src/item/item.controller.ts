import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemDetailsDto } from './dto/item-details.dto';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('/additem')
  async create(@Body() payload: CreateItemDto): Promise<any> {
    return await this.itemService.createItem(payload);
  }

  @Get('/getitems')
  async getItems(@Query('storeId', ParseIntPipe) storeId: number) {
    return await this.itemService.getItems(storeId);
  }

  @Post('/getitemsdetails')
  async getItemDetails(@Body() payload: ItemDetailsDto) {
    return await this.itemService.getItemDetails(payload);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemService.update(+id, updateItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }

  // item types

  @Get('/finditemtypes')
  async getItemTypes(): Promise<any> {
   return await this.itemService.getItemTypes();
  }

  // brand

  @Get('/brands')
  async getBrands(): Promise<any> {
   return await this.itemService.getBrands();
  }

  // category

  @Get('/getcategories')
  async getCategories(): Promise<any> {
   return await this.itemService.getCategories();
  }

  @Get('/getattributes')
  async getAttributesWithValue(): Promise<any> {
   return await this.itemService.getAttributesWithValue();
  }

}
