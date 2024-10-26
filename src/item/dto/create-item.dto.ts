import { IsInt, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateItemDto {
  @IsInt()
  itemTypeId: number;

  @IsString()
  name: string;

  @IsInt()
  brandId: number;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsInt()
  subCategoryId?: number;

  @IsOptional()
  @IsInt()
  childSubCategoryId?: number;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsInt()
  stock: number;
  
}
