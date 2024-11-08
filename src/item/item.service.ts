import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { AttributeDto, CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { ItemTypes } from './entities/item-type.entity';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { ItemVariation } from './entities/item-variation.entity';
import { ItemVariationAttribute } from './entities/item-variation-attribute.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { Attribute } from './entities/attribute.entity';

@Injectable()
export class ItemService {

  @InjectRepository(Item)
  private itemsRepository: Repository<Item>
  @InjectRepository(Store)
  private readonly storeRepository: Repository<Store>
  @InjectRepository(ItemTypes)
  private readonly itemTypeRepository: Repository<ItemTypes>
  @InjectRepository(ItemVariation)
  private readonly itemVariationRepository: Repository<ItemVariation>
  @InjectRepository(ItemVariationAttribute)
  private readonly itemVariationAttributeRepository: Repository<ItemVariationAttribute>
  @InjectRepository(Brand)
  private readonly brandRepository: Repository<Brand>
  @InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>
  @InjectRepository(StoreItem)
  private readonly storeItemRepository: Repository<StoreItem>
  @InjectRepository(Attribute)
  private readonly attributeRepository: Repository<Attribute>

  async createItem(payload: CreateItemDto) {
    // Check if the store exists and retrieve the store object
    const store = await this.storeRepository.findOneBy({ id: payload.storeId });
    if (!store) {
      throw new Error(`Store with ID ${payload.storeId} does not exist.`);
    }
  
    // Check if item already exists; if not, create and save it
    let item = await this.itemsRepository.findOne({
      where: {
        name: payload.name,
        itemType: { item_type_id: payload.itemTypeId },
      },
    }) ?? await this.itemsRepository.save(
      this.itemsRepository.create({
        name: payload.name,
        itemType: { item_type_id: payload.itemTypeId },
        category: { id: payload.categoryId },
        brand: { id: payload.brandId },
        description: payload.description,
      })
    );
  
    // Handle attributes if itemTypeId is 2
    if (payload.itemTypeId === 2 && payload.attribute) {
      await this.addAttributesAndStoreItems(payload.attribute, item, store);
    } else {
      // Add a default store item if no attributes are specified
      await this.createStoreItem({ price: payload.price, stock: payload.stock }, item, store);
    }
  
    return item;
  }
  
  // Helper function to add attributes and store items
  private async addAttributesAndStoreItems(attributes: AttributeDto[], item: Item, store: Store) {
    for (const attr of attributes) {
      const { variation, isNew } = await this.findOrCreateVariation(attr.variation, item);
  
      // Only add VariationAttributes if the variation is new
      if (isNew) {
        await this.addVariationAttributes(attr.ids, variation);
      }
  
      await this.createStoreItem(attr, item, store, variation);
    }
  }
  
  // Helper function to find or create a variation, returning whether it was new
  private async findOrCreateVariation(sku: string, item: Item) {
    const existingVariation = await this.itemVariationRepository.findOneBy({ sku });
    if (existingVariation) {
      return { variation: existingVariation, isNew: false };
    }
  
    const newVariation = await this.itemVariationRepository.save(
      this.itemVariationRepository.create({ sku, item })
    );
    return { variation: newVariation, isNew: true };
  }
  
  // Helper function to add variation attributes
  private async addVariationAttributes(attributeIds: number[], variation: ItemVariation) {
    for (const id of attributeIds) {
      await this.itemVariationAttributeRepository.save(
        this.itemVariationAttributeRepository.create({
          variation,
          attributeValue: { id },
        })
      );
    }
  }
  
  // Helper function to create store item
  private async createStoreItem(attr: { price: number; stock: number }, item: Item, store: Store, variation: ItemVariation | null = null) {
    await this.storeItemRepository.save(
      this.storeItemRepository.create({
        item,
        variation,
        price: attr.price,
        stock: attr.stock,
        store,
      })
    );
  }
  
  
  

  async getItems(storeId: number): Promise<any> {

    const store = await this.storeRepository.findOneOrFail({
      where: { id: storeId },
    }).catch(() => {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    });

    return await this.itemsRepository.find({
      where: {storeItem: {store}},
      relations: ['itemType','brand','category','storeItem.store']
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
      where: {isActive: true}
    })
  }

  // categories
  async getCategories() {
    return await this.categoryRepository.find({
      where: {isActive: true}
    })
  }
  // categories
  async getAttributesWithValue() {
    return await this.attributeRepository.find({
      relations: ['values']
    })
  }
}
