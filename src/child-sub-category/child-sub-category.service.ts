import { Injectable } from '@nestjs/common';
import { CreateChildSubCategoryDto } from './dto/create-child-sub-category.dto';
import { UpdateChildSubCategoryDto } from './dto/update-child-sub-category.dto';

@Injectable()
export class ChildSubCategoryService {
  create(payload: CreateChildSubCategoryDto) {
    return 'This action adds a new childSubCategory';
  }

  findAll() {
    return `This action returns all childSubCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} childSubCategory`;
  }

  update(id: number, updateChildSubCategoryDto: UpdateChildSubCategoryDto) {
    return `This action updates a #${id} childSubCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} childSubCategory`;
  }
}
