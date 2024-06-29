import { PartialType } from '@nestjs/mapped-types';
import { CreateItemVariationAttributeDto } from './create-item-variation-attribute.dto';

export class UpdateItemVariationAttributeDto extends PartialType(CreateItemVariationAttributeDto) {}
