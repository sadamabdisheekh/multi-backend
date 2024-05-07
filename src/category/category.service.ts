import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { join } from 'path';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(CategoryEntity) private categoryRepository: Repository<CategoryEntity>) {
  }

  async create(payload: CreateCategoryDto) {
    const category = this.categoryRepository.create({
      name: payload.name,
      image: payload.image,
      priority: payload.priority,
      created_at: new Date()
    })
    return await this.categoryRepository.save(category);
  }

  async findAll() {
    const categories = await this.categoryRepository.find();

    return categories;
  }

  async findCategorywithSub(id: number): Promise<any> {
    return await this.categoryRepository.find({
      relations: ['subCategory'],
      where: { status: true, module: { id } }
    })
  }



  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
