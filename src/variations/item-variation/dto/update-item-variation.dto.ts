import { PartialType } from '@nestjs/mapped-types';
import { CreateItemVariationDto } from './create-item-variation.dto';

export class UpdateItemVariationDto extends PartialType(CreateItemVariationDto) {}
