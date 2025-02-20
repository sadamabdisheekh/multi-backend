import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AttributeDto, CreateItemDto } from './dto/create-item.dto';
import { Item } from './entities/item.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {  In, Repository } from 'typeorm';
import { Store } from 'src/stores/entities/store.entity';
import { ItemTypes } from './entities/item-type.entity';
import { Brand } from './entities/brand.entity';
import { Category } from './entities/category.entity';
import { ItemVariation } from './entities/item-variation.entity';
import { ItemVariationAttribute } from './entities/item-variation-attribute.entity';
import { StoreItem } from 'src/stores/entities/store-item.entity';
import { Attribute } from './entities/attribute.entity';
import { ItemDetailsDto } from './dto/item-details.dto';
import { UpdateStoreItemDto } from './dto/update-store-item.dto';
import { UploadService } from 'common/UploadService';
import { FilePaths } from 'common/enum';
import { FindItemsByFilterDto } from './dto/find-items-by-filter.dto';
import { ItemImage } from './entities/item-images';
import { StoreItemVariation } from 'src/stores/entities/store-item-variation.entity';

@Injectable()
export class ItemService {
constructor(
  @InjectRepository(Item)
  private itemsRepository: Repository<Item>,
  @InjectRepository(Store)
  private readonly storeRepository: Repository<Store>,
  @InjectRepository(ItemTypes)
  private readonly itemTypeRepository: Repository<ItemTypes>,
  @InjectRepository(ItemVariation)
  private readonly itemVariationRepository: Repository<ItemVariation>,
  @InjectRepository(ItemVariationAttribute)
  private readonly itemVariationAttributeRepository: Repository<ItemVariationAttribute>,
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
  private readonly storeItemVariationRepository: Repository<StoreItemVariation>,

){}
  async createItem(payload: CreateItemDto,file:Express.Multer.File) {
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
    });

    if (!item) {
      let filename = null;
      if (file) {
       filename =  this.uploadService.saveFile(file,FilePaths.ITEMS);
      }
      item = await this.itemsRepository.save(
        this.itemsRepository.create({
          name: payload.name,
          itemType: { item_type_id: payload.itemTypeId },
          category: { id: payload.categoryId },
          brand: { id: payload.brandId },
          thumbnail: filename,
          description: payload.description,
        })
      );

    }
  
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
    const existingVariation = await this.itemVariationRepository.findOneBy({ sku,item });
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
          itemVariation: variation,
          attributeValue: { id },
        })
      );
    }
  }
  
  // Helper function to create store item
  private async createStoreItem(attr: { price: number; stock: number }, item: Item, store: Store, variation: ItemVariation | null = null) {
    let storeItem = await this.storeItemRepository.findOne({
      where: { item, store },
    });

    if (!storeItem) {
      storeItem = this.storeItemRepository.create({
        item,
        store,
        price: item.itemType.item_type_id === 1 ? attr.price : null,
        stock: item.itemType.item_type_id === 1 ? attr.stock : null,
        availableStock: item.itemType.item_type_id === 1 ? attr.stock : null,
      });
  
      storeItem = await this.storeItemRepository.save(storeItem);
    }

    if (item.itemType.item_type_id === 2 && variation) {
      await this.storeItemVariationRepository.save(
        this.storeItemVariationRepository.create({
          storeItem,
          price: attr.price,
          itemVariation: variation,
          stock: attr.stock,
          availableStock: attr.stock,
        })
      );
    }
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
          itemVariation: { sku: itemVariation },
        },
      });

      if (!storeItem) {
        throw new NotFoundException(`store item not found`);
      }

      storeItem.price = price;
      storeItem.stock = stock;

      return await this.storeItemRepository.save(storeItem);
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

    async getItemAttributes(filterDto: FindItemsByFilterDto) {
    const { categoryId } = filterDto;

    const items = await this.storeItemRepository.find({
      where: {
        item: {
          category: {id: categoryId}
        }
      },
      relations: {
        itemVariation: {
          attributes: {
            attributeValue: true
          }
        }
      }
    })

    const attributeValueIds = items.flatMap(item =>
      item.itemVariation?.attributes.map(attr => attr.attributeValue.id) || []
    );

    const attributes = await this.attributeRepository.find({
      where: { values: { id: In(attributeValueIds) } },
      relations: ['values'],
    });

    return  attributes;
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

  async getItemDetailsForMobile(itemStoreId: number) {
    try {
      const itemStore = await this.storeItemRepository.findOne({
        relations: {
          store: true,
          item: {
            images: true,
            itemUnit: true
          },
          itemVariation: {
            attributes: {
              attributeValue: true,
            },
          },
        },
        where: { id: itemStoreId },
      });
  
      if (!itemStore) {
        throw new Error(`ItemStore with ID ${itemStoreId} not found.`);
      }
  
      const attributeValueIds = itemStore.itemVariation?.attributes?.map(
        (attr) => attr?.attributeValue?.id
      ) || [];
  
      const attributes = await this.attributeRepository.find({
        where: { values: { id: In(attributeValueIds) } },
        relations: ['values'],
      });
  
      return {
        itemStore,
        attributes,
      };
    } catch (error) {
      console.error(`Error fetching item details: ${error.message}`);
      throw new InternalServerErrorException('Unable to fetch item details. Please try again later.');
    }
  }


  async getItemDetailsForMobile11(itemStoreId: number) {
    try {
      const itemStore = await this.storeItemRepository.findOne({
        relations: {
          store: true,
          item: {
            images: true,
            itemUnit: true
          },
          storeItemVariation: {
            itemVariation: {
              attributes: {
                
                attributeValue: {
                  attribute: true
                },
              },
            }
          }
        },
        where: { id: itemStoreId },
      });
  
      if (!itemStore) {
        throw new Error(`ItemStore with ID ${itemStoreId} not found.`);
      }

      const attributesMap = new Map<string, Set<string>>();

      const variations = itemStore.storeItemVariation.map((variation) => {
        const variationDetails: any = {};

        const attributes = variation.itemVariation.attributes.forEach((vav) => {
          const attributeName = vav.attributeValue.attribute.name;
          const attributeValue = vav.attributeValue.name;
          if (!attributesMap.has(attributeName)) {
            attributesMap.set(attributeName, new Set());
          }
          attributesMap.get(attributeName).add(attributeValue);
      
          // Add the attribute value to the variation details
          variationDetails[attributeName.toLowerCase()] = attributeValue;
        });
        // variationDetails.attributes = variation.itemVariation.attributes;

        variationDetails.price = variation.price;
        variationDetails.stock = variation.stock;
        variationDetails.availableStock = variation.availableStock;
        return variationDetails;

      });

      return variations;
  

    } catch (error) {
      console.error(`Error fetching item details: ${error.message}`);
      throw new InternalServerErrorException('Unable to fetch item details. Please try again later.');
    }
  }

  // async getItemDetailsForMobile22(itemStoreId: number) {
  //   // Fetch the item store with necessary relations
  //   const itemStore = await this.storeItemRepository.findOne({
  //     relations: {
  //       store: true,
  //       item: {
  //         itemType: true,
  //         images: true,
  //         itemUnit: true,
  //       },
  //     },
  //     where: { id: itemStoreId },
  //   });
  
  //   if (!itemStore) {
  //     throw new Error(`ItemStore with ID ${itemStoreId} not found.`);
  //   }

  //   if (itemStore.item.itemType.item_type_id !== 2) {
  //     return { itemStore,attributes: null, variations: null };
  //   }
  

  //     const itemVariations = await this.storeItemVariationRepository.find({
  //       where: { storeItem: { id: itemStoreId } },
  //       relations: ['itemVariation.attributes.attributeValue.attribute'],
  //     });
  
  //     const attributesMap = new Map<string, Set<string>>();
  
  //     const variations = itemVariations
  //       .filter((variation) => variation.itemVariation.attributes.length > 0)
  //       .map((variation) => {
  //         const variationDetails: any = {};
  
  //         variation.itemVariation.attributes.forEach((vav) => {
  //           const attributeName = vav.attributeValue.attribute.name;
  //           const attributeValue = vav.attributeValue.name;
  
  //           if (!attributesMap.has(attributeName)) {
  //             attributesMap.set(attributeName, new Set());
  //           }
  //           attributesMap.get(attributeName).add(attributeValue);
  
  //           variationDetails[attributeName] = attributeValue;
  //         });
  
  //         variationDetails.price = variation.price;
  //         variationDetails.stock = variation.stock;
  //         variationDetails.variationId = variation.id; 
  
  //         return variationDetails;
  //       });
  
  //     const attributes = Array.from(attributesMap).map(([attributeName, values]) => ({
  //       attributeName,
  //       values: Array.from(values),
  //     }));
  
  //   return {
  //     itemStore,
  //     attributes, 
  //     variations, 
  //   };
  // }

  async getItemDetailsForMobile22(itemStoreId: number) {
    // Fetch the item store with necessary relations
    const itemStore = await this.storeItemRepository.findOne({
      relations: {
        store: true,
        item: {
          itemType: true,
          images: true,
          itemUnit: true,
        },
      },
      where: { id: itemStoreId },
    });
  
    if (!itemStore) {
      throw new Error(`ItemStore with ID ${itemStoreId} not found.`);
    }

    if (itemStore.item.itemType.item_type_id !== 2) {
      return { itemStore,attributes: null, variations: null };
    }
  
      const itemVariations = await this.storeItemVariationRepository.find({
        where: { storeItem: { id: itemStoreId } },
        relations: ['itemVariation.attributes.attributeValue.attribute'],
      });
  
      const attributesMap = new Map<string, { values: Set<{ id: number; name: string }>; id: number }>();
  
      const variations = itemVariations
        .filter((variation) => variation.itemVariation.attributes.length > 0)
        .map((variation) => {
          const variationDetails: any = {};
  
          variation.itemVariation.attributes.forEach((vav) => {
            const attributeId = vav.attributeValue.attribute.id;
            const attributeName = vav.attributeValue.attribute.name;
            const attributeValueId = vav.attributeValue.id;
            const attributeValue = vav.attributeValue.name;
  
            if (!attributesMap.has(attributeName)) {
              attributesMap.set(attributeName, { values: new Set(), id: attributeId });
            }
            attributesMap.get(attributeName).values.add({ id: attributeValueId, name: attributeValue });
  
            variationDetails[attributeName] = {
              attributeId,
              attributeValueId,
              attributeValue,
            };
          });
  
          variationDetails.price = variation.price;
          variationDetails.stock = variation.stock;
          variationDetails.variationId = variation.id;
  
          return variationDetails;
        });
  
      const attributes = Array.from(attributesMap).map(([attributeName, { values, id }]) => ({
        attributeId: id,
        attributeName,
        values: Array.from(values),
      }));
  
    return {
      attributes, 
      variations, 
    };
  }
  
}
