import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AttributeDto, CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {  In, Like, MoreThan, Repository } from 'typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { ItemVariation } from './entities/item-variation.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { Attribute } from './entities/attribute.entity';
import { ItemDetailsDto } from './dto/item-details.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { UploadService } from 'common/UploadService';
import { FilePaths } from 'common/enum';
import { FindItemsByFilterDto } from './dto/find-items-by-filter.dto';
import { ItemImage } from './entities/item-images.entity';
import { ItemVariationAttributeValue } from './entities/item-variation-attribute-value.entity';
import { StoreItemVariation } from 'src/stores/entities/store-item-variation.entity';

@Injectable()
export class ItemService {
constructor(
  @InjectRepository(Item)
  private itemsRepository: Repository<Item>,
  @InjectRepository(Store)
  private readonly storeRepository: Repository<Store>,
  @InjectRepository(ItemVariation)
  private readonly itemVariationRepository: Repository<ItemVariation>,
  @InjectRepository(ItemVariationAttributeValue)
  private readonly itemVariationAttributeValueRepository: Repository<ItemVariationAttributeValue>,
  @InjectRepository(Brand)
  private readonly brandRepository: Repository<Brand>,
  @InjectRepository(Category)
  private readonly categoryRepository: Repository<Category>,
  @InjectRepository(StoreItem)
  private readonly storeItemRepository: Repository<StoreItem>,
  @InjectRepository(Attribute)
  private readonly attributeRepository: Repository<Attribute>,
  private readonly uploadService: UploadService, 
  @InjectRepository(ItemImage)
  private readonly itemImagesRepository: Repository<ItemImage>,
  @InjectRepository(StoreItemVariation)
  private readonly storeItemVariationRepository: Repository<StoreItemVariation>

){}

async createItem(payload: CreateItemDto, file: Express.Multer.File) {
  // 1. Validate store exists
  const store = await this.storeRepository.findOneBy({ id: payload.storeId });
  if (!store) {
    throw new NotFoundException(`Store with ID ${payload.storeId} does not exist.`);
  }

  // 2. Find or create item
  const item = await this.findOrCreateItem(payload, file);

  
  if (payload.hasVariation && payload.attribute) {
    for (const attr of payload.attribute) {
      // Find or create variation
      let variation = await this.itemVariationRepository.findOneBy({ 
        sku: attr.variation, 
        item: { id: item.id }  
      });
      
      if (!variation) {
        variation = await this.itemVariationRepository.save(
          this.itemVariationRepository.create({ 
            sku: attr.variation, 
            item,
            variationName: attr.variation 
          })
        );

        // Create variation attributes for new variations
        const attributeValues = attr.attrIds.map((id,index) => ({
          itemVariation: variation,
          attribute: {id},
          attributeValue: { id: attr.ids[index]  },
        }));
        await this.itemVariationAttributeValueRepository.save(attributeValues);
      }

      // Create store item variation
      await this.handleStoreItem(item, store, attr, variation);
    }
  } else {
    // Handle simple item without variations
    await this.handleStoreItem(item, store, payload);
  }
  
  return item;
}

private async findOrCreateItem(payload: CreateItemDto, file: Express.Multer.File): Promise<Item> {
  // Try to find existing item
  if (payload.itemId) {
    const existingItem = await this.itemsRepository.findOneBy({ id: payload.itemId });
    if (existingItem) return existingItem;
  } else {
    const existingItem = await this.itemsRepository.findOne({
      where: {
        name: payload.name,
        category: { id: payload.categoryId },
        hasVariations: payload.hasVariation,
      },
    });
    if (existingItem) return existingItem;
  }

  // Create new item
  const filename = file ? this.uploadService.saveFile(file, FilePaths.ITEMS) : null;
  
  return this.itemsRepository.save({
    name: payload.name,
    hasVariations: payload.hasVariation,
    category: { id: payload.categoryId },
    brand: { id: payload.brandId },
    thumbnail: filename,
    description: payload.description,
  });
}

private async handleStoreItem(
  item: Item, 
  store: Store, 
  data: { price: number; stock: number }, 
  variation?: ItemVariation
) {
  // For items without variations
  if (!item.hasVariations) {
    let storeItem = await this.storeItemRepository.findOne({
      where: { item: { id: item.id }, store: { id: store.id } },
    });

    if (!storeItem) {
      storeItem = this.storeItemRepository.create({
        item,
        store,
        price: data.price,
        stock: data.stock,
        stockAlert: null,
        createdAt: new Date(),
      });
    } else {
      storeItem.price = data.price;
      storeItem.stock += data.stock;
    }

    await this.storeItemRepository.save(storeItem);
    return;
  }

  // For items with variations
  let storeItem = await this.storeItemRepository.findOne({
    where: { item: { id: item.id }, store: { id: store.id } },
  });

  if (!storeItem) {
    storeItem = await this.storeItemRepository.save({
      item,
      store,
      price: null,
      stock: null,
      stockAlert: null,
      createdAt: new Date(),
    });
  }

  // Create variation record
  try {
    await this.storeItemVariationRepository.save({
      storeItem,
      price: data.price,
      cost: null,
      stock: data.stock,
      variation,
      availableFrom: new Date(),
      availableTo: null,
    });
  } catch (error) {
    throw new InternalServerErrorException('Failed to save store item variation');
  }
}
async findStoreItemsInStockWithAttributes(storeId: number) {
  const storeItems = await this.storeItemRepository.find({
    where: {
      store: { id: storeId },
      storeItemVariation: {
        stock: MoreThan(0),
      },
    },
    relations: [
      'item',
      'storeItemVariation',
      'storeItemVariation.variation',
      'storeItemVariation.variation.attributeValues',
      'storeItemVariation.variation.attributeValues.attribute',
      'storeItemVariation.variation.attributeValues.attributeValue',
    ],
  });

  return storeItems.map(storeItem => ({
    id: storeItem.item.id,
    name: storeItem.item.name,
    description: storeItem.item.description,
    thumbnail: storeItem.item.thumbnail,
    hasVariations: storeItem.item.hasVariations,
    basePrice: storeItem.price,
    variations: storeItem.storeItemVariation.map(v => ({
      id: v.id,
      name: v.variation.variationName,
      price: Number(v.price),
      stock: v.stock,
      attributes: v.variation.attributeValues.map(av => ({
        attributeId: av.attribute.id,
        attributeName: av.attribute.name  || '',
        attributeValue: av.attributeValue.value || '',
        valueId: av.id,
      })),
    }))
  }));
}


async findAvailablePrices(storeItemId: number, variationId?: number) {
  return this.storeItemVariationRepository.find({
    relations: {
      storeItem: {
        item: true
      }
    },
    order: { price: 'ASC' }, // optional
  });
}

async findCheapestPrice(storeItemId: number, variationId?: number) {
  return this.storeItemVariationRepository.find({
    order: { price: 'ASC' },
  });
}


  

  async getItems(storeId: number): Promise<any> {

    const store = await this.storeRepository.findOneOrFail({
      where: { id: storeId },
    }).catch(() => {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    });

    const item = await this.itemsRepository.find({
      where: {storeItem: {store}},
      relations: ['brand','category']
    })

    return {
      item,
      store
    }
  }

  async getItemDetails(payload: ItemDetailsDto) {

    const [item, store] = await Promise.all([
      this.itemsRepository.findOneOrFail({
        where: { id: payload.itemId },
      }).catch(() => {
        throw new NotFoundException(`Item with ID ${payload.itemId} not found`);
      }),
      this.storeRepository.findOneByOrFail({ id: payload.storeId }).catch(() => {
        throw new NotFoundException(`Store with ID ${payload.storeId} not found`);
      }),
    ]);


    const res = await this.storeItemRepository.findOne({
      where: {
        item: {id: item.id},
        store: {id: store.id}
      },
      relations: ['store','storeItemVariation','storeItemVariation.variation']
    });
    return res;
    }

    async updateStoreItem(payload: UpdateStoreItemDto) {
      const {storeItemId,storeItemVariationId,price,stock,isItemHasVariations} = payload;

      if (isItemHasVariations) {
        const storeItemVariation = await this.storeItemVariationRepository.findOne({
          where: { id: storeItemVariationId },
        });

        if (!storeItemVariation) {
          throw new NotFoundException(`Store item variation with ID ${storeItemVariationId} not found`);
        }

        storeItemVariation.price = price;
        storeItemVariation.stock = stock;

        return await this.storeItemVariationRepository.save(storeItemVariation);
      }

      const storeItem = await this.storeItemRepository.findOne({
        where: { id: storeItemId },
      });
      if (!storeItem) {
        throw new NotFoundException(`Store item with ID ${storeItemId} not found`);
      }
      storeItem.price = price;
      storeItem.stock = stock;
      return await this.storeItemRepository.save(storeItem);
    }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }


  // brands
  async getBrands() {
    return await this.brandRepository.find({
      where: {isActive: true}
    })
  }

  // categories
  async addCategory(file: Express.Multer.File,payload: any) {

    const fileName = this.uploadService.saveFile(file, FilePaths.CATEGERORY);
    const category = this.categoryRepository.create({
      name: payload.name,
      isActive: payload.isActive,
      parentId: payload.parent ?? null,
      image: fileName
    })
    return await this.categoryRepository.save(category)
  }

  async updateCategory(id:number,file: Express.Multer.File,payload: any) {
    const {name,status} = payload;

    const category = await this.categoryRepository.findOneBy({
      id
    });
    if (!category) {
      throw new NotFoundException(`category not found`);
    }


    let filePath = null;
    if (file) {
      filePath = this.uploadService.saveFile(file,FilePaths.CATEGERORY,FilePaths.CATEGERORY + category.image);
    }

    category.name = name;
    category.isActive = status;
    if (filePath) {
      category.image = filePath;
    }

    return await this.categoryRepository.save(category);

  }

  async getCategories() {
    return await this.categoryRepository.find()
  }
  // categories
  async getAttributesWithValue() {
    return await this.attributeRepository.find({
      relations: ['values']
    })
  }

  async getCategoryHierarchy(parent: number | null = null): Promise<Category[]> {
    const queryBuilder = this.categoryRepository.createQueryBuilder('category')
      .leftJoinAndSelect('category.children', 'children');
  
    if (parent === null) {
      queryBuilder.where('category.parentId IS NULL');
    } else {
      queryBuilder.where('category.parentId = :parentId', { parentId: parent });
    }
  
    const categories = await queryBuilder.getMany();
  
    for (const category of categories) {
      category.children = await this.getCategoryHierarchy(category.id); // Recursively load children
    }
  
    return categories;
  }

  async getItemsByFilter(filterDto: FindItemsByFilterDto) {
    const { categoryId, brandId, attributeValueIds} = filterDto;


    const categoryChildren = await this.getCategoryHierarchy(categoryId);

    const categoryIds = this.flattenCategoryIds(categoryChildren, [categoryId]);

    const whereConditions:  any = {
      item: {
        category: { id: In(categoryIds) }, 
      },
    };

    if (attributeValueIds && attributeValueIds.length > 0) {
      whereConditions.itemVariation = {
        attributes: {
          attributeValue: {id: In(attributeValueIds)}
        }
      }
    }
  
    if (brandId) {
      whereConditions.item.brand = { id: brandId };
    }

    const items = await this.storeItemRepository.find({
      where: whereConditions,
      relations: {
        item: true,
        store: true,
      }
    })
    return  items;
  }

  private flattenCategoryIds(categories: Category[], result: number[] = []): number[] {
    for (const category of categories) {
      result.push(category.id);
      if (category.children) {
        this.flattenCategoryIds(category.children, result);
      }
    }
    return result;
  }

  async uploadItemImages(itemId: number, files: Express.Multer.File[]): Promise<void> {
    const uploadPromises = files.map(async (file) => {
      const filename = this.uploadService.saveFile(file, FilePaths.ITEMS);
      if (!filename) throw new Error(`Failed to save file: ${file.originalname}`);
  
      const itemImage = this.itemImagesRepository.create({
        item: { id: itemId },
        image_url: filename,
      });
  
      await this.itemImagesRepository.save(itemImage);
    });
  
    try {
      await Promise.all(uploadPromises);
    } catch (error) {
      console.error(`Error uploading images for item ${itemId}:`, error);
      throw error; // Propagate the error to the caller
    }
  }

  async getItemImage(itemId: number) {
    return await this.itemImagesRepository.find({
      where: {
        item: {id: itemId},
      }
    })
  }
  
  async removeItemImage(id: number) {
    const itemImage = await this.itemImagesRepository.findOne({ where: { id } });
  
    if (!itemImage) {
      throw new NotFoundException(`Image with ID ${id} not found. Deletion not possible.`);
    }
  
    try {
      await this.itemImagesRepository.remove(itemImage);
  
      this.uploadService.deleteFile(FilePaths.ITEMS + itemImage.image_url);
  
      return; 
    } catch (error) {
      throw new InternalServerErrorException('An error occurred while deleting the image.');
    }
  }


  // use like
  async getItemByName(name: string) {
    return await this.itemsRepository.find({
      relations: {
        category: true,
        itemUnit: true,
        brand: true,
      },
      where: {name: Like(`%${name}%`)}
    })
  }
    
}
