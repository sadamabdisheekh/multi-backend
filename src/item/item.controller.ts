import { Controller, Get, Post, Body, Request, Param, Delete, Query, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Patch } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemDetailsDto } from './dto/item-details.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindItemsByFilterDto } from './dto/find-items-by-filter.dto';

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

  @Post('/addcategory')
  @UseInterceptors(FileInterceptor('file'))
  async addCategory(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: any
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is not defined');
    }
   return await this.itemService.addCategory(file,payload);
  }


  @Get('/getcategories')
  async getCategories(): Promise<any> {
   return await this.itemService.getCategories();
  }

  @Patch('updatecategory/:id')
  @UseInterceptors(FileInterceptor('file'))
  update(
    @UploadedFile() file: Express.Multer.File,
    @Param('id', ParseIntPipe) id: number, 
    @Body() payload: any
  ) {
    return this.itemService.updateCategory(id,file, payload);
  }

  @Get('/getattributes')
  async getAttributesWithValue(): Promise<any> {
   return await this.itemService.getAttributesWithValue();
  }

  @Get('getcategoryhierarchy')
  async getCategoryHierarchy(@Query('categoryId') categoryId: any) {
    const parsedCategoryId = categoryId && categoryId != 'null' ? Number(categoryId) : null;
    if (categoryId && isNaN(parsedCategoryId)) {
      throw new BadRequestException('Invalid categoryId. It must be a number or empty.');
    }
    return await this.itemService.getCategoryHierarchy(parsedCategoryId);
  }

  @Post('getitemsbyfilter')
  async getItemsByFilter(
    @Body() filterDto: FindItemsByFilterDto
  ) {
    return await this.itemService.getItemsByFilter(filterDto);
  }
}
