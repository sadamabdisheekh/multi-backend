import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { getFileUploadConfig } from 'src/common/file-upload.config';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }


  @Post('uploads')
  @UseInterceptors(FileInterceptor('file', getFileUploadConfig('category')))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({ fileType: 'image/png' })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY }),
    )
    file: Express.Multer.File,
    @Body() payload: CreateCategoryDto
  ) {
    payload.image = file.filename;
    return this.categoryService.create(payload);
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
