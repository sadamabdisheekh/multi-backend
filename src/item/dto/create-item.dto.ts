import { IsArray, IsNumber, IsOptional, IsString, ValidateNested, IsNotEmpty, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class AttributeDto {
  @IsNumber()
  id: number;

  @IsString()
  @IsNotEmpty() 
  variation: string;

  @IsOptional()
  @IsNumber()
  stock: number | null;

  @IsNumber()
  price: number;

  @IsArray()
  @IsNumber({}, { each: true })
  ids: number[];
}

export class CreateItemDto {
  @IsBoolean()
  hasVariation: boolean;

  @IsOptional()
  @IsNumber()
  itemId: number | null;


  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsOptional() 
  @IsNumber()
  brandId: number | null;

  @IsOptional()
  @IsNumber()
  categoryId: number;

  @IsNumber()
  storeId: number;

  @IsOptional()
  @IsNumber()
  stock: number | null;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttributeDto) 
  attribute: AttributeDto[];
}
