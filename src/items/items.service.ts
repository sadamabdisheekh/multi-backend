import { ConflictException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
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
import { Brand } from './entities/brand.entity';
import { ItemVariationDto } from './dto/item-variation.dto';

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
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,

  ) { }

  async create(payload: CreateItemDto): Promise<ItemsEntity> {
    try {
      // Check if item name already exists
      const existingItem = await this.itemsRepository.findOne({ where: { name: payload.name } });
      if (existingItem) {
        throw new ConflictException('An item with this name already exists');
      }

      const store = await this.storeRepository.findOne({ where: { id: payload.storeId } });
      if (!store) {
        throw new NotFoundException('store not found');
      }

      const brand = await this.brandRepository.findOne({ where: { brandId: payload.brandId } });
      // Find item type
      const itemType = await this.itemTypeRepository.findOne({ where: { item_type_id: payload.itemType } });
      if (!itemType) {
        throw new NotFoundException('Item type not found');
      }

      // Find category and sub-category
      const category = await this.categoryRepository.findOne({ where: { id: payload.categoryId } });
      const subCategory = await this.subcategoryRepository.findOne({ where: { id: payload.subCategoryId } });

      if (!category || !subCategory) {
        throw new NotFoundException('Category or Subcategory not found');
      }

      // Create new item
      const item = new ItemsEntity();
      item.itemType = itemType;
      item.name = payload.name;
      // Set other properties as needed
      await this.itemsRepository.save(item);

      // Create item variations
      if (payload.attributes.length === 0) {
        await this.createItemVariation(payload, item, store, brand, category, subCategory);
      } else {
        for (const attr of payload.attributes) {
          await this.createVariationsForAttributes(attr, payload, item, store, brand, category, subCategory);
        }
      }

      return item;
    } catch (error) {
      // Log or handle the error appropriately
      console.error('Error creating item:', error);
      throw new InternalServerErrorException('An error occurred while creating the item');
    }
  }

  private async createItemVariation(payload: CreateItemDto, item: ItemsEntity, store: Store, brand: Brand, category: CategoryEntity, subCategory: SubCategoryEntity) {
    const itemVariation = new ItemVariation();
    itemVariation.item = item;
    itemVariation.name = payload.name;
    itemVariation.cost = payload.cost;
    itemVariation.price = payload.price;
    itemVariation.stock = payload.stock;
    itemVariation.stockAlert = payload.stockAlert;
    itemVariation.description = payload.description;
    itemVariation.available_time_starts = payload.available_time_starts;
    itemVariation.available_time_ends = payload.available_time_ends;
    itemVariation.category = category;
    itemVariation.subCategory = subCategory;
    itemVariation.store = store;
    itemVariation.brand = brand;

    await this.itemVariationRepository.save(itemVariation);
  }

  private async createVariationsForAttributes(attr: any, payload: CreateItemDto, item: ItemsEntity, store: Store, brand: Brand, category: CategoryEntity, subCategory: SubCategoryEntity) {
    for (const variation of attr.variations) {
      const itemVariation = new ItemVariation();
      itemVariation.item = item;
      itemVariation.name = payload.name;
      itemVariation.sku = variation.sku;
      itemVariation.cost = variation.cost;
      itemVariation.price = variation.price;
      itemVariation.stock = variation.stock;
      itemVariation.stockAlert = variation.stockAlert;
      itemVariation.description = payload.description;
      itemVariation.available_time_starts = payload.available_time_starts;
      itemVariation.available_time_ends = payload.available_time_ends;
      itemVariation.category = category;
      itemVariation.subCategory = subCategory;
      itemVariation.store = store;
      itemVariation.brand = brand;

      await this.itemVariationRepository.save(itemVariation);

      // Create item variation attribute
      const itemVariationValue = new ItemVariationAttribute();
      itemVariationValue.itemVariation = itemVariation;
      const attribute = await this.attributesRepository.findOne({ where: { id: attr.attributeId.id } });
      const attributeValue = await this.attributesValueRepository.findOne({ where: { id: variation.attributeValueId } });

      if (attribute && attributeValue) {
        itemVariationValue.attribute = attribute;
        itemVariationValue.attributeValue = attributeValue;
        await this.itemVariationAttributeRepository.save(itemVariationValue);
      } else {
        throw new NotFoundException('Attribute or Attribute Value not found');
      }
    }
  }


  async findAll(): Promise<any> {
    return await this.itemsRepository.find({
      relations: ['itemVariations']
    })
  }
  async findAll1(): Promise<any> {
    const queryBuilder = this.itemsRepository.createQueryBuilder('item')
      .innerJoinAndSelect('item.itemType', 'itemType')
      .innerJoinAndSelect('item.itemVariations', 'variation')
      .leftJoinAndSelect('variation.category', 'category')
      .leftJoinAndSelect('variation.itemVariationAttributes', 'attr')
      .leftJoinAndSelect('attr.attribute', 'attribute')
      .leftJoinAndSelect('attr.attributeValue', 'attributeValue')
    // .where('item.name LIKE :name', { name: `%${name}%` });

    const items = await queryBuilder.getMany();
    return items;
  }

  async findItemDetials(itemId: number): Promise<any> {
    const item = await this.itemsRepository.findOne({
      relations: ['itemType', 'itemVariations', 'itemVariations.category', 'itemVariations.brand'],
      where: { id: itemId }
    })
    const itemDetials = await this.itemVariationAttributeRepository.find({
      relations: {
        attribute: true,
        attributeValue: true,
        itemVariation: true,
      },
      where: { itemVariation: { item: { id: itemId } } }
    })

    return {
      item,
      itemDetials
    }
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
      where: { isActive: true }
    })
  }

  async getAttributes() {
    return this.attributesRepository.find({
      relations: {
        attributeValues: true
      },
    })
  }

  async getAllBrands() {
    return await this.brandRepository.find({
      where: { active: true }
    })
  }

  async updateItemVariation(itemVariationId: number, payload: ItemVariationDto) {
    const itemVariation = await this.itemVariationRepository.findOneBy({
      id: itemVariationId
    })

    if (!itemVariation) {
      throw new NotAcceptableException('this item variation not found');
    }

    itemVariation.cost = payload.itemCost;
    itemVariation.price = payload.itemPrice;
    itemVariation.sku = payload.sku;
    itemVariation.stockAlert = payload.stockAlert;

    return await this.itemVariationRepository.save(itemVariation);

  }

  async addItemVariation(payload: ItemVariationDto) {
    const findItem = await this.itemVariationRepository.findOne({
      relations: ['item', 'category', 'store', 'subCategory'],
      where: { id: payload.itemId }
    });

    if (!findItem) {
      throw new NotFoundException('Item not found');
    }

    const itemVariation = this.itemVariationRepository.create({
      name: findItem.item.name,
      item: findItem.item,
      store: findItem.store,
      category: findItem.category,
      subCategory: findItem.subCategory,
      sku: payload.sku,
      cost: payload.itemCost,
      price: payload.itemPrice
    });

    const savedItemVariation = await this.itemVariationRepository.save(itemVariation);

    if (payload.attributeId && payload.attributeValueId) {
      const itemAttributes = this.itemVariationAttributeRepository.create({
        itemVariation: savedItemVariation,
        attribute: { id: payload.attributeId },
        attributeValue: { id: payload.attributeValueId }
      });

      return this.itemVariationAttributeRepository.save(itemAttributes);
    }

    return savedItemVariation;
  }


}
