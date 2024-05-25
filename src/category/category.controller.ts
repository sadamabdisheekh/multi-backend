import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpStatus, ParseFilePipeBuilder, BadRequestException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Post('uploads')
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


  // @Get('/categorywithsub/:id')
  // findCategoryWithSub(@Param('id') moduleId: number) {
  //   return this.categoryService.findCategoryWithSub(moduleId);
  // }

  @Get()
  findCategoryWithSub() {
    return this.categoryService.findCategoryWithSub();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
