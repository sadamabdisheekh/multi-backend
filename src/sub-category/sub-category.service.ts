import { Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { SubCategoryEntity } from './sub-category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SubCategoryService {

  constructor(@InjectRepository(SubCategoryEntity) private subcatRepository: Repository<SubCategoryEntity>) {
  }

  create(payload: CreateSubCategoryDto) {
    const data = this.subcatRepository.create({
      subCategoryName: payload.subCategoryName,
      category: {id: payload.categoryId}
    })
  }

  findAll() {
    return `This action returns all subCategory`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subCategory`;
  }

  update(id: number, updateSubCategoryDto: UpdateSubCategoryDto) {
    return `This action updates a #${id} subCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subCategory`;
  }
}
