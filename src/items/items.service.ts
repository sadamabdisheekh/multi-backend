import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Filter } from './dto/filter.dto';
import { ItemsEntity } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CategoryEntity } from 'src/category/entities/category.entity';
import { Store } from 'src/stores/entities/store.entity';
import { ItemTypes } from './entities/item-type.entity';
import { ItemVariation } from './entities/item-variation.entity';
import { ItemVariationAttribute } from './entities/item-variation-attribute.entity';
import { Attribute } from './entities/attribute.entity';
import { AttributeValue } from './entities/attribute-value.entity';
import { SubCategoryEntity } from 'src/category/entities/sub-category.entity';

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemsEntity) 
    private itemsRepository: Repository<ItemsEntity>,
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
    @InjectRepository(SubCategoryEntity)
    private readonly subcategoryRepository: Repository<SubCategoryEntity>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(ItemTypes)
    private readonly itemTypeRepository: Repository<ItemTypes>,
    @InjectRepository(AttributeValue)
    private readonly attributesValueRepository: Repository<AttributeValue>,
    @InjectRepository(Attribute)
    private readonly attributesRepository: Repository<Attribute>,
    @InjectRepository(ItemVariation)
    private readonly itemVariationRepository: Repository<ItemVariation>,
    @InjectRepository(ItemVariationAttribute)
    private readonly itemVariationAttributeRepository: Repository<ItemVariationAttribute>,
    
  ) { }

  async create(payload: CreateItemDto): Promise<ItemsEntity> {
    const itemType = await this.itemTypeRepository.findOneBy({item_type_id: payload.itemType});
    if (!itemType) {
      throw new NotFoundException(`item type not found`);
    }
    const item = new ItemsEntity();
    item.itemType = itemType;
    item.name = payload.name;
    // Set other properties as needed
    await this.itemsRepository.save(item);

    if (payload.attributes.length == 0) {
      
    }

    for (const attr of payload.attributes) {
      for (const variation of attr.variations) {
        const itemVariation = new ItemVariation();
        itemVariation.item = item;
        itemVariation.name = payload.name;
        itemVariation.sku = variation.sku;
        itemVariation.cost = payload.cost;
        itemVariation.price = variation.price;
        itemVariation.stock = variation.stock;
        itemVariation.stockAlert = variation.stockAlert;
        itemVariation.description = payload.description;
        itemVariation.available_time_starts = payload.available_time_starts;
        itemVariation.available_time_ends = payload.available_time_ends;
        const category = await this.categoryRepository.findOneBy({ id: payload.categoryId });
        itemVariation.category = category;
        const subCategory = await this.subcategoryRepository.findOneBy({ id: payload.subCategoryId });
        itemVariation.subCategory = subCategory;
        await this.itemVariationRepository.save(itemVariation);

        for (const attrValue of attr.attributeValueId) {
          const itemVariationValue = new ItemVariationAttribute();
          itemVariationValue.itemVariation = itemVariation;
          const attribute = await this.attributesRepository.findOne({ where: { id: attr.attributeId.id } });
          itemVariationValue.attribute = attribute;

          // Fetch and assign the related attribute value entity
          const attributeValue = await this.attributesValueRepository.findOne({ where: { id: attrValue.id } });
          itemVariationValue.attributeValue = attributeValue;
          await this.itemVariationAttributeRepository.save(itemVariationValue);
        }
      }
    }
    return item;
  }

  async findAll(name: string): Promise<any> {
    return await this.itemsRepository.find({
      where: {
        name: Like(`%${name}%`)
      }
    });
  }

  async findItemsByFilter(filter: Filter) {
    return await this.itemsRepository.find({
      // where: {
      //   category: { id: filter.categoryId },
      //   subCategory: { id: filter.subCategoryId },
      //   childSubCategory: { id: filter.childSubCategoryId },
      // }
    })
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }


  async findItemTypes() {
    return this.itemTypeRepository.find({
      where: {isActive : true}
    })
  }

  async getAttributes() {
    return this.attributesRepository.find({
      relations: {
        attributeValues: true
      },
    })
  }


}
