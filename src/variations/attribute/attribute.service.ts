import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { CreateAttributeDto } from './dto/create-attribute.dto';
import { Attribute } from './entities/attribute.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAttributeValueDto } from './dto/create-attribute-value.dto';
import { AttributeValue } from './entities/attribute-value.entity';

@Injectable()
export class AttributeService {
   constructor(
    @InjectRepository(Attribute) 
    private attributeRepository: Repository<Attribute>,
    @InjectRepository(AttributeValue) 
    private attributeValueRepository: Repository<AttributeValue>
   ) {}
  async create(payload: CreateAttributeDto) {
    const isAttributeExists = await this.attributeRepository.findOneBy({name: payload.name});
    if (isAttributeExists) {
      throw new NotAcceptableException(`attribute with ${payload.name} already exists`);
    }
    const attribute = this.attributeRepository.create({
      name: payload.name
    })
    return await this.attributeRepository.save(attribute);
  }

  async addAttributeValue(payload: CreateAttributeValueDto): Promise<AttributeValue> {
    const { attributeId } = payload;

    // Check if attribute exists
    const attribute = await this.attributeRepository.findOneBy({id :attributeId});
    if (!attribute) {
      throw new NotFoundException(`Attribute with ID ${attributeId} not found`);
    }

    const attributeValue = this.attributeValueRepository.create({
      value: payload.value,
      attribute
    });

    return await this.attributeValueRepository.save(attributeValue);
  }

  findAll() {
    return `This action returns all attribute`;
  }

  findOne(id: number) {
    return `This action returns a #${id} attribute`;
  }

  update(id: number, payload: any) {
    return `This action updates a #${id} attribute`;
  }

  remove(id: number) {
    return `This action removes a #${id} attribute`;
  }
}
