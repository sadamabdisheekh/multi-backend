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
import { StoreItemPrice } from 'src/stores/entities/store-item-price.entity';

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
  @InjectRepository(StoreItemPrice)
  private readonly storeItemPriceRepository: Repository<StoreItemPrice>

){}
  async createItem(payload: CreateItemDto,file:Express.Multer.File) {
    // Check if the store exists and retrieve the store object
    const store = await this.storeRepository.findOneBy({ id: payload.storeId });
    if (!store) {
      throw new Error(`Store with ID ${payload.storeId} does not exist.`);
    }

    let item = null;
    if (payload.itemId) {
      item = await this.itemsRepository.findOneBy({ id: payload.itemId });
    }else {
      item = await this.itemsRepository.findOne({
        where: {
          name: payload.name,
          category: { id: payload.categoryId },
        },
      });
    }

    if (!item) {
      let filename = null;
      if (file) {
       filename =  this.uploadService.saveFile(file,FilePaths.ITEMS);
      }
      item = await this.itemsRepository.save(
        this.itemsRepository.create({
          name: payload.name,
          hasVariations: payload.hasVariation,
          category: { id: payload.categoryId },
          brand: { id: payload.brandId },
          thumbnail: filename,
          description: payload.description,
        })
      );

    }
  
    // Handle attributes if itemTypeId is 2
    if (payload.hasVariation && payload.attribute) {
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
        await this.addVariationAttributes(attr, variation);
      }
  
      await this.createStoreItem(attr, item, store, variation);
    }
  }
  
  // Helper function to find or create a variation, returning whether it was new
  private async findOrCreateVariation(sku: string, item: Item) {
    const existingVariation = await this.itemVariationRepository.findOneBy({ sku,item: { id: item.id }  });
    if (existingVariation) {
      return { variation: existingVariation, isNew: false };
    }
  
    const newVariation = await this.itemVariationRepository.save(
      this.itemVariationRepository.create({ sku, item ,variationName: sku})
    );
    return { variation: newVariation, isNew: true };
  }
  
  // Helper function to add variation attributes
  private async addVariationAttributes(attr: any, variation: ItemVariation) {
    for (const id of attr.ids) {
      await this.itemVariationAttributeValueRepository.save(
        this.itemVariationAttributeValueRepository.create({
          variation: variation,
          attributeValue: { id },
          attribute: { id: attr.id }, // Assuming attribute ID is the same as attributeValue ID
        })
      );
    }
  }
  
  // Helper function to create store item
  private async createStoreItem(attr: { price: number; stock: number }, item: Item, store: Store, variation: ItemVariation | null = null) {
    let storeItem = await this.storeItemRepository.findOne({
      where: { item :{id: item.id}, store: {id: store.id} },
    });
    if (!storeItem) {
      let createStoreItem = this.storeItemRepository.create({
        item,
        store,
        createdAt: new Date(),
      });
      storeItem = await this.storeItemRepository.save(createStoreItem);
    } 

    // // find existing store item price or create a new one
    // let existingPrice = await this.storeItemPriceRepository.findOne({
    //   where: { storeItem: {id: storeItem.id}, variation: {id: variation.id || null} },
    // });

    // if (existingPrice) {
    //   existingPrice.price = attr.price;
    //   existingPrice.stock += attr.stock;
    //   try {
    //     await this.storeItemPriceRepository.save(existingPrice);
    //     return;
    //   } catch (error) {
    //     throw new InternalServerErrorException('Failed to update store item price');
    //   }
    // }

    let createStoreItemPrice = this.storeItemPriceRepository.create({
      storeItem,
      price: attr.price,
      stock: attr.stock,
      variation: variation  || null,  
      availableFrom: new Date(),
      availableTo: null, 
    });
    try {
      await this.storeItemPriceRepository.save(createStoreItemPrice);
    } catch (error) {
      throw new InternalServerErrorException('Failed to save store item price');
    }

  }
  
  async findStoreItemsInStockWithAttributes(storeId: number) {
  return this.storeItemRepository.find({
    where: {
      store: { id: storeId },
      prices: {
        stock: MoreThan(0),
      },
    },
    relations: [
      'item',
      'prices',
      'prices.variation',
      'prices.variation.attributeValues',
      'prices.variation.attributeValues.attribute',
    ],
  });
}

async findAvailablePrices(storeItemId: number, variationId?: number) {
  return this.storeItemPriceRepository.find({
    relations: {
      storeItem: {
        item: true
      }
    },
    where: {
      storeItem: { id: storeItemId },
      variation: variationId ? { id: variationId } : null,
      stock: MoreThan(0),
    },
    order: { price: 'ASC' }, // optional
  });
}

async findCheapestPrice(storeItemId: number, variationId?: number) {
  return this.storeItemPriceRepository.findOne({
    where: {
      storeItem: { id: storeItemId },
      variation: variationId ? { id: variationId } : null,
      stock: MoreThan(0),
    },
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
      relations: ['itemType','brand','category']
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


    return await this.storeItemRepository.find({
      where: {
        item: {id: item.id},
        store: {id: store.id}
      },
      relations: ['item.itemType','store','itemVariation']
    })
    }

    async updateStoreItem(payload: UpdateStoreItemDto) {
      const {itemId,storeId,itemVariation,price,stock} = payload;
      const storeItem = await this.storeItemRepository.findOne({
        where: {
          store: { id: storeId },
          item: { id: itemId },
          // itemVariation: { sku: itemVariation },
        },
      });

      if (!storeItem) {
        throw new NotFoundException(`store item not found`);
      }

      // storeItem.price = price;
      // storeItem.stock = stock;

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
