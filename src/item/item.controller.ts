import { Controller, Get, Post, Body, Request, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemDetailsDto } from './dto/item-details.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

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

  @UseGuards(JwtAuthGuard)
  @Post('/getitemsdetails')
  async getItemDetails(@Body() payload: ItemDetailsDto,@Request() req) {
    const user = req.user;
    return await this.itemService.getItemDetails(payload);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.itemService.remove(+id);
  }

  @Post('/updatestoreitem')
  updateStoreItem(@Body() payload: UpdateStoreItemDto) {
    return this.itemService.updateStoreItem(payload)
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
