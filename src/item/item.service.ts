import { ConflictException, Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { ItemTypes } from './entities/itemType.entity';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { Brand } from './entities/brand.entity';

@Injectable()
export class ItemService {

  @InjectRepository(Item)
  private itemsRepository: Repository<Item>
  @InjectRepository(CategoryEntity)
  private readonly categoryRepository: Repository<CategoryEntity>
  @InjectRepository(Store)
  private readonly storeRepository: Repository<Store>
  @InjectRepository(ItemTypes)
  private readonly itemTypeRepository: Repository<ItemTypes>
  @InjectRepository(Brand)
  private readonly brandRepository: Repository<Brand>



  async createItem(payload: CreateItemDto) {
    const {itemTypeId,name,brandId,categoryId,subCategoryId,childSubCategoryId,description,price,stock} = payload;
    
     const existingItem = await this.itemsRepository.findOne({
      where: {
        name,
        category: { id: categoryId },
        itemType: { item_type_id: itemTypeId },
      },
    });

    if (existingItem) {
      throw new ConflictException('An item with this name, category, and type already exists.');
    }

    const createItem = this.itemsRepository.create({
      itemType: {item_type_id: itemTypeId},
      name: name,
      brand: {brandId},
      category: {id: categoryId},
      sub_category: {id: subCategoryId},
      child_sub_category: {id: childSubCategoryId},
      description: description,
      price: itemTypeId == 1 ? price : null,
      stock: itemTypeId == 1 ? stock : null,
    });

    return await this.itemsRepository.save(createItem);
  }

  async getItems(): Promise<any> {
    return await this.itemsRepository.find({
      relations: ['itemType','brand','category']
    })
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }

  // item types
  async getItemTypes() {
    return await this.itemTypeRepository.find({
      where: {isActive: true}
    })
  }

  // brands
  async getBrands() {
    return await this.brandRepository.find({
      where: {active: true}
    })
  }
}
