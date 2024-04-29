import { PartialType } from '@nestjs/mapped-types';
import { CreateChildSubCategoryDto } from './create-child-sub-category.dto';

export class UpdateChildSubCategoryDto extends PartialType(CreateChildSubCategoryDto) {}
