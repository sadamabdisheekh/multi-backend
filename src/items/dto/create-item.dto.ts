import { IsString, IsInt, IsOptional, IsNumber, IsArray, IsBoolean, IsNotEmpty, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

// Define nested DTOs for more complex structures

class AttributeIdDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}

class AttributeValueDto {
  @IsInt()
  id: number;

  @IsString()
  @IsNotEmpty()
  value: string;
}

class VariationDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;

  @IsInt()
  stockAlert: number;

  @IsInt()
  attributeValueId: number;
}

class AttributeDto {
  @ValidateNested()
  @Type(() => AttributeIdDto)
  attributeId: AttributeIdDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeValueDto)
  attributeValueId: AttributeValueDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariationDto)
  variations: VariationDto[];
}

export class CreateItemDto {
  @IsInt()
  itemType: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsInt()
  subCategoryId?: number;

  @IsOptional()
  @IsInt()
  childSubCategoryId?: number;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsInt()
  stock?: number;

  @IsOptional()
  @IsInt()
  stockAlert?: number;

  @IsNumber()
  price: number;

  @IsNumber()
  cost: number;

  @IsBoolean()
  hasAvailableTime: boolean;

  @IsOptional()
  @IsNotEmpty()
  available_time_starts?: string;

  @IsOptional()
  @IsNotEmpty()
  available_time_ends?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto)
  attributes: AttributeDto[];
}
