import { IsArray, IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class FindItemsByFilterDto {
    @IsOptional()
    @IsNotEmpty()
    @IsNumber()
    categoryId?: number; 

    @IsOptional()
    @IsNumber()
    brandId?: number;

    @IsOptional()
    @IsArray()
    @IsNumber({}, { each: true })
    attributeValueIds?: number[];
  }
  