import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemVariationDto } from './dto/create-item-variation.dto';
import { UpdateItemVariationDto } from './dto/update-item-variation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemVariation } from './entities/item-variation.entity';
import { Repository } from 'typeorm';
import { ItemsEntity } from 'src/items/entities/item.entity';

@Injectable()
export class ItemVariationService {
  constructor(
    @InjectRepository(ItemVariation)
    private itemVariationRepository: Repository<ItemVariation>,
    @InjectRepository(ItemsEntity)
    private itemRepository: Repository<ItemsEntity>
  ) {}

  async create(payload: CreateItemVariationDto) {
    const item = await this.itemRepository.findOneBy({id: payload.itemId});
    if (!item) {
      throw new NotFoundException(`item with id ${payload.itemId} not found`);
    }

    const itemVariation = this.itemVariationRepository.create({
      item: item,
      sku: payload.sku,
      stock: payload.stock,
      additionalPrice: payload.additionalPrice
    })

    return await this.itemVariationRepository.save(itemVariation);
  }

  async getItemVariationsReport(): Promise<any> {
    return await this.itemVariationRepository
      .createQueryBuilder('itemVariation')
      .leftJoinAndSelect('itemVariation.item', 'item')
      .leftJoinAndSelect('itemVariation.itemVariationAttributes', 'itemVariationAttribute')
      .leftJoinAndSelect('itemVariationAttribute.attribute', 'attribute')
      .leftJoinAndSelect('itemVariationAttribute.attributeValue', 'attributeValue')
      .select([
        'itemVariation.id',
        'itemVariation.sku',
        'itemVariation.stock',
        'itemVariation.additionalPrice',
        'item.name',
        'item.price',
        'attribute.name',
        'attributeValue.value',
      ])
      .getMany();
  }

  findAll() {
    return `This action returns all itemVariation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemVariation`;
  }

  update(id: number, updateItemVariationDto: UpdateItemVariationDto) {
    return `This action updates a #${id} itemVariation`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemVariation`;
  }
}
