import { Controller, Get, Post, Body, Request, Param, Delete, Query, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Patch } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemDetailsDto } from './dto/item-details.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FindItemsByFilterDto } from './dto/find-items-by-filter.dto';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Controller('item')
export class ItemController {
  constructor(private readonly itemService: ItemService) {}

  @Post('/additem')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body('jsondata') jsondata: string 
  ): Promise<any> {
    if (!file) {
      throw new BadRequestException('File is not defined');
    }

    const parsedData = plainToInstance(CreateItemDto, JSON.parse(jsondata));

    const errors = await validate(parsedData);
    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
    
    return await this.itemService.createItem(parsedData,file);
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
