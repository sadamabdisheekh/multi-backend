import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpStatus, ParseFilePipeBuilder, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateSubCategoryDto } from './dto/create-subcategory.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Post('add')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: CreateCategoryDto
  ) {
    if (!file) {
      throw new BadRequestException('File is not defined');
    }
    return this.categoryService.create(file,payload);
  }

  @Get()
  findCategoryWithSub() {
    return this.categoryService.findCategoryWithSub();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  update(
    @Param('id') id: number, 
    @UploadedFile() file: Express.Multer.File,
    @Body() payload: UpdateCategoryDto)
    {
    return this.categoryService.update(id,file,payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }


  
  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: memoryStorage(),
  }))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createSubCategoryDto: CreateSubCategoryDto
  ) {
    return this.categoryService.createSubCategory(file,createSubCategoryDto);
  }
}
