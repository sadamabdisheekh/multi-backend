import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ChildSubCategoryService } from './child-sub-category.service';
import { CreateChildSubCategoryDto } from './dto/create-child-sub-category.dto';
import { UpdateChildSubCategoryDto } from './dto/update-child-sub-category.dto';

@Controller('child-sub-category')
export class ChildSubCategoryController {
  constructor(private readonly childSubCategoryService: ChildSubCategoryService) { }

  @Post()
  create(@Body() payload: CreateChildSubCategoryDto) {
    return this.childSubCategoryService.create(payload);
  }

  @Get()
  findAll() {
    return this.childSubCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.childSubCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() payload: UpdateChildSubCategoryDto) {
    return this.childSubCategoryService.update(+id, payload);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.childSubCategoryService.remove(+id);
  }
}
