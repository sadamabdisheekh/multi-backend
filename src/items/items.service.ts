import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Filter } from './dto/filter.dto';
import { ItemsEntity } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/category/category.entity';
import { Store } from 'src/stores/entities/store.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemsEntity) private itemsRepository: Repository<ItemsEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoriesRepository: Repository<CategoryEntity>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) { }
  async create(payload: CreateItemDto) {
    const category = await this.categoriesRepository.findOne({
      where: { id: payload.categoryId }
    });

    if (!category) {
      throw new NotFoundException('category not found');
    }

    const existingStore = await this.storeRepository.findOne({
      where: { id: payload.store_id }
    });

    if (!existingStore) {
      throw new NotFoundException(`store with the id ${payload.store_id} not exist`);
    }

    const items = this.itemsRepository.create({
      name: payload.name,
      description: payload.description,
      category: category,
      subCategory: null,
      
      childSubCategory: null,
      created_at: new Date(),
      price: payload.price,
      discount: payload.discount,
      available_time_starts: payload.available_time_starts,
      available_time_ends: payload.available_time_ends
    });
    return await this.itemsRepository.save(items);
  }

  findAll() {
    return `This action returns all items`;
  }

  async findItemsByFilter(filter: Filter) {
    return await this.itemsRepository.find({
      where: {
        category: { id: filter.categoryId },
        subCategory: { id: filter.subCategoryId },
        childSubCategory: { id: filter.childSubCategoryId },
      }
    })
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
