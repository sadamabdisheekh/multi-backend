import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemVariationAttributeDto } from './dto/create-item-variation-attribute.dto';
import { UpdateItemVariationAttributeDto } from './dto/update-item-variation-attribute.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ItemVariationAttribute } from './entities/item-variation-attribute.entity';
import { Repository } from 'typeorm';
import { Attribute } from '../attribute/entities/attribute.entity';
import { AttributeValue } from '../attribute/entities/attribute-value.entity';
import { ItemVariation } from '../item-variation/entities/item-variation.entity';

@Injectable()
export class ItemVariationAttributeService {
  constructor(
    @InjectRepository(ItemVariationAttribute)
    private itemVariationAttributeRepository: Repository<ItemVariationAttribute>,
    @InjectRepository(Attribute)
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue)
    private attributeValueRepository: Repository<AttributeValue>,
    @InjectRepository(ItemVariation)
    private itemVariationRepository: Repository<ItemVariation>,
  ) {}

  async create(payload: CreateItemVariationAttributeDto) {
    try {
      const [attribute, attributeValue, itemVariation] = await Promise.all([
        this.attributeRepository.findOneBy({ id: payload.attributeId }),
        this.attributeValueRepository.findOneBy({ id: payload.attributeValueId }),
        this.itemVariationRepository.findOneBy({ id: payload.itemVariationId })
      ]);
  
      if (!attribute) {
        throw new NotFoundException(`Attribute with ID ${payload.attributeId} not found`);
      }
      if (!attributeValue) {
        throw new NotFoundException(`Attribute value with ID ${payload.attributeValueId} not found`);
      }
      if (!itemVariation) {
        throw new NotFoundException(`Item variation with ID ${payload.itemVariationId} not found`);
      }
  
      const isItemVariationAttributeRecordExist = await this.itemVariationAttributeRepository.findOne({
        where: {
          attribute: attribute,
          attributeValue: attributeValue,
          itemVariation: itemVariation
        }
      });
  
      if (isItemVariationAttributeRecordExist) {
        throw new ConflictException(`Item variation attribute record already exists`);
      }
  
      const createItemVariationAttribute = this.itemVariationAttributeRepository.create({
        attribute: attribute,
        attributeValue: attributeValue,
        itemVariation: itemVariation
      });
  
      return await this.itemVariationAttributeRepository.save(createItemVariationAttribute);
    } catch (ex) {
      throw ex;
    }
  }
  

  findAll() {
    return `This action returns all itemVariationAttribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} itemVariationAttribute`;
  }

  update(id: number, updateItemVariationAttributeDto: UpdateItemVariationAttributeDto) {
    return `This action updates a #${id} itemVariationAttribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} itemVariationAttribute`;
  }
}
