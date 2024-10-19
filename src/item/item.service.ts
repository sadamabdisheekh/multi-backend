import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { Store } from 'src/stores/entities/store.entity';
import { ItemTypes } from './entities/itemType.entity';

@Injectable()
export class ItemService {

  @InjectRepository(Item)
  private itemsRepository: Repository<Item>
  @InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>
  @InjectRepository(Store)
  private readonly storeRepository: Repository<Store>
  @InjectRepository(ItemTypes)
  private readonly itemTypeRepository: Repository<ItemTypes>



  create(payload: CreateItemDto) {
    
  }

  findAll() {
    return `This action returns all item`;
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
