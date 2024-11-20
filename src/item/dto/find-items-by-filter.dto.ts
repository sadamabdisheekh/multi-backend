import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";

export class FindItemsByFilterDto {
    @IsNotEmpty()
    @IsNumber()
    categoryId: number; 

    @IsOptional()
    @IsNumber()
    brandId?: number;
  }
  