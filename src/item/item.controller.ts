import { Controller, Get, Post, Body, Request, Param, Delete, Query, ParseIntPipe, UseGuards, UseInterceptors, UploadedFile, BadRequestException, Patch, UploadedFiles, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ItemService } from './item.service';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemDetailsDto } from './dto/item-details.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
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

  @Post(':itemId/images')
  @UseInterceptors(FilesInterceptor('files')) // Handles multiple file uploads
  async uploadItemImages(
    @Param('itemId', ParseIntPipe) itemId: number,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<{ message: string }> {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }

    try {
      await this.itemService.uploadItemImages(itemId, files);
      return { message: 'Images uploaded successfully' };
    } catch (error) {
      throw new BadRequestException(`Failed to upload images: ${error.message}`);
    }
  }

  @Get('itemimages/:itemId')
  async getItemImage(@Param('itemId') itemId: number) {
    return await this.itemService.getItemImage(itemId);
  }

  @Delete('removeimage/:id')
  async removeItemImage(@Param('id') id: number) {
    try {
      await this.itemService.removeItemImage(id);
      return { message: 'Image successfully deleted' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  @Get('getItemDetailsForMobile')
  async getItemDetailsForMobile(@Query('storeItemId') storeItemId: number) {
    return this.itemService.getItemDetailsForMobile(storeItemId);
  }
}
